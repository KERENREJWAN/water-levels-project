import torch
import torch.nn as nn
import numpy as np
from torch.utils.data import DataLoader, TensorDataset

# --- 1. Load the Data ---
data = np.load('kinneret_training_data.npz')
X_raw = data['X'] # Shape: (Samples, 30, Features)
y_raw = data['y'] # Shape: (Samples,)

# Convert to PyTorch Tensors
X = torch.tensor(X_raw, dtype=torch.float32)
y = torch.tensor(y_raw, dtype=torch.float32).view(-1, 1)

# Split into Training and Testing (Chronological split for time-series)
train_size = int(0.8 * len(X))
X_train, X_test = X[:train_size], X[train_size:]
y_train, y_test = y[:train_size], y[train_size:]

# Create DataLoaders
train_loader = DataLoader(TensorDataset(X_train, y_train), batch_size=32, shuffle=True)

# --- 2. Define the LSTM Architecture ---
class KinneretLSTM(nn.Module):
    def __init__(self, input_size, hidden_size, num_layers):
        super(KinneretLSTM, self).__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        
        # LSTM Layer: processes the 30-day sequence
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True)
        
        # Fully Connected Layer: converts LSTM output to the 1D Delta prediction
        self.fc = nn.Linear(hidden_size, 1)

    def forward(self, x):
        # Initialize hidden state and cell state with zeros
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size)
        c0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size)
        
        # Forward propagate LSTM
        out, _ = self.lstm(x, (h0, c0)) 
        
        # Decode the hidden state of the last time step (the 30th day)
        out = self.fc(out[:, -1, :])
        return out

# Initialize model
input_dim = X.shape[2] # Number of features from preprocessing
model = KinneretLSTM(input_size=input_dim, hidden_size=64, num_layers=2)

# --- 3. Training Setup ---
criterion = nn.MSELoss() # Mean Squared Error is best for numeric regression
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

# --- 4. The Training Loop ---
epochs = 50
for epoch in range(epochs):
    model.train()
    for batch_X, batch_y in train_loader:
        # Forward pass
        outputs = model(batch_X)
        loss = criterion(outputs, batch_y)
        
        # Backward and optimize
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
    
    if (epoch+1) % 10 == 0:
        print(f'Epoch [{epoch+1}/{epochs}], Loss: {loss.item():.6f}')

# Save the trained model
torch.save(model.state_dict(), 'kinneret_lstm_model.pth')
print("Model trained and saved as 'kinneret_lstm_model.pth'")