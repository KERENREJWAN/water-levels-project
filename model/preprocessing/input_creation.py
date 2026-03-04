import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import joblib

# Load and sort data
df_final = pd.read_csv('model/df_final.csv', parse_dates=['date'])
df = df_final.copy().sort_values('date')
df['date'] = pd.to_datetime(df['date'], dayfirst=True, errors='coerce')

# --- STEP 1: Cyclical Date Encoding (Seasonality) ---
# We convert the date into a circular coordinate to represent the time of year
day_of_year = df['date'].dt.dayofyear
df['day_sin'] = np.sin(2 * np.pi * day_of_year / 365.25)
df['day_cos'] = np.cos(2 * np.pi * day_of_year / 365.25)

# --- STEP 2: Calculate the Target (Output) ---
# Target: Level(t+7) - Level(t)
df['target_diff'] = df['Kinneret_Level'].shift(-7) - df['Kinneret_Level']

# Drop the last 7 rows as they have no future target
df = df.dropna(subset=['target_diff'])

# --- STEP 3: Feature Selection and Scaling ---
# We keep day_sin and day_cos, but drop the raw 'date' object
features_to_use = df.drop(columns=['date', 'target_diff'])

# Normalize all features (including our new seasonal ones) to [0, 1]
scaler = MinMaxScaler()
scaled_features = scaler.fit_transform(features_to_use)

# Save the scaler for future use
joblib.dump(scaler, 'model/kinneret_scaler.pkl')

# --- STEP 4: Create Sliding Windows (30 Days Input) ---
def create_sequences(data, targets, window_size=30):
    X, y = [], []
    for i in range(len(data) - window_size):
        # 30-day sequence of features (including seasonality)
        X.append(data[i : i + window_size])
        # Target associated with the last day of the window
        y.append(targets[i + window_size - 1])
    return np.array(X), np.array(y)

window_size = 30
X, y = create_sequences(scaled_features, df['target_diff'].values, window_size)

# --- STEP 5: Save the Prepared Data ---
np.savez_compressed('model/kinneret_training_data.npz', X=X, y=y)

print("Preprocessing Complete with Seasonal Encoding.")
print(f"Features included: {list(features_to_use.columns)}")
print(f"Final Data Shape: {X.shape}")