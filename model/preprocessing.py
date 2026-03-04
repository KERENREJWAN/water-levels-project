import pandas as pd
import json

# Load datasets
with open('smallerkinneret.json') as f:
    df_kinneret = pd.DataFrame(json.load(f))

with open('smallerrain.json') as f:
    df_rain = pd.DataFrame(json.load(f))

with open('smallerweather.json') as f:
    df_weather = pd.DataFrame(json.load(f))

stations = ["Kfar_Giladi", "Marom_Golan", "Tzfat_Har_Kenaan", "Gamla", "Kfar_Blum", "Amiad", "Capernaum", "Samakh"]

# --- 1. Kinneret Level (Target) ---
df_kinneret['date'] = pd.to_datetime(df_kinneret['Survey_Date'], dayfirst=True)
df_kinneret = df_kinneret[['date', 'Kinneret_Level']].sort_values('date')

# --- 2. Rain (Individual Stations) ---
df_rain['date'] = pd.to_datetime(df_rain['date'], dayfirst=True)
# Fill missing rain values with 0 per station
for st in stations:
    df_rain[st] = pd.to_numeric(df_rain[st], errors='coerce').fillna(0)

# Rename rain columns to distinguish them from weather
rain_cols = {st: f"Rain_{st}" for st in stations}
df_rain = df_rain[['date'] + stations].rename(columns=rain_cols)

# --- 3. Weather (Daily Max across all hours) ---
import pandas as pd
import json

# --- 1. Load your weather data ---
with open('weather.json') as f:
    weather_list = json.load(f)
df_weather = pd.DataFrame(weather_list)

stations = ["Kfar_Giladi", "Marom_Golan", "Tzfat_Har_Kenaan", "Gamla", "Kfar_Blum", "Amiad", "Capernaum", "Samakh"]

# --- 2. Clean and Convert ---
# Convert the 'date' string to a datetime object
df_weather['date_dt'] = pd.to_datetime(df_weather['date'], format='%d-%m-%Y %H:%M')

# Create a 'day' column to group by
df_weather['day'] = df_weather['date_dt'].dt.normalize()

# Ensure all station columns are numeric (critical!)
for st in stations:
    df_weather[st] = pd.to_numeric(df_weather[st], errors='coerce')

# --- 3. The Daily Max Aggregation ---
# This finds the max for each measurement (cname) for each DAY
# Result: One row for Temperature on Feb 22, one row for Humidity on Feb 22, etc.
daily_summary = df_weather.groupby(['day', 'cname'])[stations].max().reset_index()

from sklearn.experimental import enable_iterative_imputer
from sklearn.impute import IterativeImputer
import pandas as pd
import numpy as np

def fix_station_gaps(df, station_list):
    """
    Uses Iterative Imputation to fill gaps in weather/rain stations.
    It predicts missing values based on the values of other stations.
    """
    # 1. Create a copy to avoid modifying the original dataframe directly
    df_clean = df.copy()

    # 2. Initialize the Imputer
    # 'sample_posterior=True' adds a bit of natural variation so the data isn't 'too perfect'
    imputer = IterativeImputer(max_iter=15, random_state=42, sample_posterior=True)

    # 3. Apply imputation only to the station columns
    # We do this per 'cname' (Temperature, Humidity, etc.)
    # because Temperature patterns are different from Wind patterns.
    if 'cname' in df_clean.columns:
        for measurement in df_clean['cname'].unique():
            mask = df_clean['cname'] == measurement
            if df_clean.loc[mask, station_list].isnull().values.any():
                print(f"Fixing gaps for: {measurement}...")
                df_clean.loc[mask, station_list] = imputer.fit_transform(df_clean.loc[mask, station_list])
    else:
        # For Rain data which doesn't have a 'cname' column
        df_clean[station_list] = imputer.fit_transform(df_clean[station_list])

    return df_clean

# For Weather:
df_weather_fixed = fix_station_gaps(df_weather, stations)

# --- 4. The Pivot (The Fix) ---
# We pivot so that each 'cname' becomes its own set of columns.
# index='day' ensures we get one row per day.
# columns='cname' ensures Temperature, Humidity, etc. move to the top.
df_weather_pivoted = daily_summary.pivot(index='day', columns='cname')

# --- 5. Clean up Column Names ---
# This converts the MultiIndex (e.g., 'Kfar_Giladi', 'Temperature') into a single string
# Format: "Temperature_Kfar_Giladi"
df_weather_pivoted.columns = [f"{col[1]}_{col[0]}" for col in df_weather_pivoted.columns]
df_weather_pivoted = df_weather_pivoted.reset_index().rename(columns={'day': 'date'})

# --- 6. Debugging Check ---
# This will show you the first few rows of specific columns to prove they are different
test_cols = [c for c in df_weather_pivoted.columns if "Temperature" in c][:2]

# # --- 4. Final Merge & Lag Features ---
df_final = df_kinneret.merge(df_rain, on='date', how='left')
df_final = df_final.merge(df_weather_pivoted, on='date', how='left')

# # Sort and fill any remaining gaps in rain/weather with 0
df_final = df_final.sort_values('date').fillna(0)

# # Critical Feature Engineering: Lagged Level
# df_final['level_lag_1'] = df_final['Kinneret_Level'].shift(1)

# # Clean up: Drop the first row because it won't have a 'level_lag_1'
# df_final = df_final.dropna(subset=['level_lag_1'])

# # Save df_final to a CSV file
df_final.to_csv('df_final.csv', index=False)
print("df_final saved to 'df_final.csv'")


##### step 2
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import joblib

# Load and sort data
df = df_final.copy().sort_values('date')

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
joblib.dump(scaler, 'kinneret_scaler.pkl')

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
np.savez_compressed('kinneret_training_data.npz', X=X, y=y)

print("Preprocessing Complete with Seasonal Encoding.")
print(f"Features included: {list(features_to_use.columns)}")
print(f"Final Data Shape: {X.shape}")