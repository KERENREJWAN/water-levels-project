import torch
import numpy as np
import pandas as pd
import joblib

def predict_future_level(new_data_df, model_path='best_kinneret_transformer.pth', scaler_path='kinneret_scaler.pkl'):
    # 1. Load the Scaler and the Model
    scaler = joblib.load(scaler_path)
    
    # Identify dimensions from the scaler
    input_dim = scaler.n_features_in_
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    model = KinneretTransformer(input_dim=input_dim)
    model.load_state_dict(torch.load(model_path, map_location=torch.device('cuda')))
    model.to(device)
    model.eval()

    # 2. Preprocess the incoming 30-day window
    # Ensure the dataframe is sorted and has the same columns as training
    # (Including day_sin, day_cos, and all city weather/rain columns)
    
    # We drop 'Date' if it exists because the model only takes numerical features
    if 'Date' in new_data_df.columns:
        new_data_df = new_data_df.drop(columns=['Date'])
    
    # Scale the features
    expected_order = list(scaler.feature_names_in_)

    # 2. Rearrange your new_data_df to match that order exactly
    # This also drops any extra columns (like 'target') that shouldn't be scaled
    aligned_df = new_data_df[expected_order]

    # 3. Now scale the aligned data
    scaled_data = scaler.transform(aligned_df)
    
    # Convert to Tensor (Batch size of 1, 30 days, N features)
    input_tensor = torch.tensor(scaled_data, dtype=torch.float32).unsqueeze(0).to(device)

    # 3. Perform Prediction
    with torch.no_grad():
        prediction = model(input_tensor)
        predicted_diff = prediction.item()

    # 4. Result Interpretation
    # Since the model predicts Level(t+7) - Level(t)
    current_level = new_data_df['Kinneret_Level'].iloc[-1]
    predicted_level = current_level + predicted_diff
    
    return predicted_level, predicted_diff

# Example usage:
latest_30_days = pd.read_csv('test.csv')
level, diff = predict_future_level(latest_30_days)
print(f"Predicted Level in 7 days: {level:.3f} (Change: {diff:+.3f})")