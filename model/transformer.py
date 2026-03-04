import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader, Subset
import numpy as np
import os

# ==========================================
# 1. THE TRANSFORMER MODEL ARCHITECTURE
# ==========================================
class PositionalEncoding(nn.Module):
    def __init__(self, d_model, max_len=5000):
        super(PositionalEncoding, self).__init__()
        pe = torch.zeros(max_len, d_model)
        position = torch.arange(0, max_len, dtype=torch.float).unsqueeze(1)
        div_term = torch.exp(torch.arange(0, d_model, 2).float() * (-np.log(10000.0) / d_model))
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        pe = pe.unsqueeze(0)
        self.register_buffer('pe', pe)

    def forward(self, x):
        return x + self.pe[:, :x.size(1)]

class KinneretTransformer(nn.Module):
    def __init__(self, input_dim, model_dim=64, num_heads=4, num_layers=3, dropout=0.1):
        super(KinneretTransformer, self).__init__()
        
        # Project raw features (e.g., 85 features) to model dimension (64)
        self.input_projection = nn.Linear(input_dim, model_dim)
        self.pos_encoder = PositionalEncoding(model_dim)
        
        encoder_layers = nn.TransformerEncoderLayer(
            d_model=model_dim, 
            nhead=num_heads, 
            dim_feedforward=model_dim * 4, 
            dropout=dropout,
            batch_first=True
        )
        self.transformer_encoder = nn.TransformerEncoder(encoder_layers, num_layers=num_layers)
        
        # Regression head to predict the 7-day water level change
        self.decoder = nn.Sequential(
            nn.Linear(model_dim, 32),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(32, 1)
        )

    def forward(self, x):
        # x shape: [Batch, 30, Features]
        x = self.input_projection(x)
        x = self.pos_encoder(x)
        x = self.transformer_encoder(x)
        
        # Take the state of the final day in the window (day 30) for prediction
        x = x[:, -1, :] 
        return self.decoder(x)

# ==========================================
# 2. DATASET LOADER
# ==========================================
class KinneretDataset(Dataset):
    def __init__(self, data_path):
        if not os.path.exists(data_path):
            raise FileNotFoundError(f"Missing {data_path}. Run preprocessing script first.")
        
        data = np.load(data_path)
        self.X = torch.tensor(data['X'], dtype=torch.float32)
        self.y = torch.tensor(data['y'], dtype=torch.float32).unsqueeze(1)

    def __len__(self):
        return len(self.X)

    def __getitem__(self, idx):
        return self.X[idx], self.y[idx]

# ==========================================
# 3. TRAINING ENGINE
# ==========================================
def run_training():
    # Load Data
    full_dataset = KinneretDataset('kinneret_training_data.npz')
    input_size = full_dataset.X.shape[2]
    
    # Split: 80% train, 20% validation (Temporal split)
    train_size = int(0.8 * len(full_dataset))
    train_loader = DataLoader(Subset(full_dataset, range(train_size)), batch_size=32, shuffle=True)
    val_loader = DataLoader(Subset(full_dataset, range(train_size, len(full_dataset))), batch_size=32)

    # Init Model, Loss, Optimizer
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = KinneretTransformer(input_dim=input_size).to(device)
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=0.0005)

    print(f"Starting training on {device}...")
    best_val_loss = float('inf')

    for epoch in range(100):
        # Train
        model.train()
        total_train_loss = 0
        for batch_X, batch_y in train_loader:
            batch_X, batch_y = batch_X.to(device), batch_y.to(device)
            
            optimizer.zero_grad()
            outputs = model(batch_X)
            loss = criterion(outputs, batch_y)
            loss.backward()
            optimizer.step()
            total_train_loss += loss.item()

        # Validate
        model.eval()
        total_val_loss = 0
        with torch.no_grad():
            for batch_X, batch_y in val_loader:
                batch_X, batch_y = batch_X.to(device), batch_y.to(device)
                outputs = model(batch_X)
                total_val_loss += criterion(outputs, batch_y).item()

        avg_train = total_train_loss / len(train_loader)
        avg_val = total_val_loss / len(val_loader)

        if (epoch + 1) % 10 == 0:
            print(f"Epoch {epoch+1:03d} | Train MSE: {avg_train:.6f} | Val MSE: {avg_val:.6f}")

        # Save Best Model
        if avg_val < best_val_loss:
            best_val_loss = avg_val
            torch.save(model.state_dict(), 'best_kinneret_transformer.pth')

    print("Training complete. Best model saved to 'best_kinneret_transformer.pth'.")

if __name__ == "__main__":
    run_training()