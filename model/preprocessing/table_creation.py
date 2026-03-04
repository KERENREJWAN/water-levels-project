import pandas as pd
import numpy as np
import json

def preprocess_kinneret_data(level_data, rain_data, weather_data):
    # ---------------------------------------------------------
    # 1. Process Water Level Data (Forward Fill for missing days)
    # ---------------------------------------------------------
    df_level = pd.DataFrame(level_data)
    df_level['Survey_Date'] = pd.to_datetime(df_level['Survey_Date'], format='%d/%m/%Y')
    df_level = df_level.set_index('Survey_Date')[['Kinneret_Level']]
    
    # Resample to daily and fill missing days with the last known value
    df_level = df_level.resample('D').ffill().bfill()
    
    # ---------------------------------------------------------
    # 2. Process Daily Rainfall Data (Fill ALL missing with 0)
    # ---------------------------------------------------------
    df_rain = pd.DataFrame(rain_data)
    df_rain['date'] = pd.to_datetime(df_rain['date'], format='%d/%m/%Y')
    df_rain = df_rain.drop('cname', axis=1, errors='ignore').set_index('date')
    
    # Force all values to numeric (turns blanks/strings into NaN)
    df_rain = df_rain.apply(pd.to_numeric, errors='coerce')
    
    # Fill existing NaNs with 0, resample for missing days, and fill those new days with 0
    df_rain = df_rain.fillna(0).resample('D').asfreq().fillna(0)
    df_rain = df_rain.add_suffix('_Rain')

    # ---------------------------------------------------------
    # 3. Process 3-Hourly Weather Data (Max Daily + Neighbors)
    # ---------------------------------------------------------
    df_weather = pd.DataFrame(weather_data)
    df_weather['date'] = pd.to_datetime(df_weather['date'], format='%d-%m-%Y %H:%M')
    df_weather['date_only'] = df_weather['date'].dt.floor('D')
    
    city_cols = [col for col in df_weather.columns if col not in ['date', 'cname', 'date_only']]
    
    for col in city_cols:
        df_weather[col] = pd.to_numeric(df_weather[col], errors='coerce')
        
    df_daily_weather = df_weather.groupby(['date_only', 'cname'])[city_cols].max().reset_index()

    neighbor_map = {
        "Kfar_Giladi": "Kfar_Blum",       
        "Kfar_Blum": "Kfar_Giladi",
        "Tzfat_Har_Kenaan": "Marom_Golan", 
        "Marom_Golan": "Tzfat_Har_Kenaan", 
        "Gamla": "Samakh",                
        "Samakh": "Capernaum",            
        "Capernaum": "Amiad",
        "Amiad": "Capernaum"
    }

    for city, neighbor in neighbor_map.items():
        if city in df_daily_weather.columns and neighbor in df_daily_weather.columns:
            df_daily_weather[city] = df_daily_weather[city].fillna(df_daily_weather[neighbor])

    df_daily_weather[city_cols] = df_daily_weather.apply(
        lambda row: row[city_cols].fillna(row[city_cols].mean()), axis=1
    )

    df_weather_pivot = df_daily_weather.pivot(index='date_only', columns='cname', values=city_cols)
    df_weather_pivot.columns = [f"{city}_{metric.replace(' ', '_')}" for city, metric in df_weather_pivot.columns]

    # ---------------------------------------------------------
    # 4. Merge and Extract Date Features
    # ---------------------------------------------------------
    df_final = pd.concat([df_level, df_rain, df_weather_pivot], axis=1)
    df_final = df_final.dropna(subset=['Kinneret_Level'])

    # Bring the Date index back out as a standard column
    df_final = df_final.reset_index(names='date')
    
    return df_final

# Load datasets
with open('model/training_data/kinneret.json') as f:
    df_kinneret = pd.DataFrame(json.load(f))

with open('model/training_data/rain.json') as f:
    df_rain = pd.DataFrame(json.load(f))

with open('model/training_data/weather.json') as f:
    df_weather = pd.DataFrame(json.load(f))

df_final = preprocess_kinneret_data(df_kinneret, df_rain, df_weather)
df_final.to_csv('model/df_final.csv', index=False)
print("df_final saved to 'df_final.csv'")