import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from xgboost import XGBRegressor
import joblib

# -------------------------------
# Step 1. Load dataset
# -------------------------------
df = pd.read_csv("delhi_crime_dataset_v4.csv")
df['date'] = pd.to_datetime(df['date'])

# -------------------------------
# Step 2. Aggregate weekly per area
# -------------------------------
df['week_start'] = df['date'] - pd.to_timedelta(df['date'].dt.weekday, unit='D')
weekly = df.groupby(['week_start', 'location', 'crime_type']).size().reset_index(name='count')

# Pivot to get one row per area per week
weekly_pivot = weekly.pivot_table(index=['week_start', 'location'], 
                                  columns='crime_type', 
                                  values='count', 
                                  fill_value=0).reset_index()

# Add total crimes
weekly_pivot['total_crimes'] = weekly_pivot[[
    c for c in weekly_pivot.columns if c not in ['week_start', 'location']
]].sum(axis=1)

# Sort
weekly_pivot = weekly_pivot.sort_values(['location', 'week_start']).reset_index(drop=True)

# -------------------------------
# Step 3. Create lag features (previous week & trend)
# -------------------------------
weekly_pivot['prev_week'] = weekly_pivot.groupby('location')['total_crimes'].shift(1)
weekly_pivot['trend'] = weekly_pivot['total_crimes'] - weekly_pivot['prev_week']
weekly_pivot['avg_last3'] = weekly_pivot.groupby('location')['total_crimes'].rolling(3, min_periods=1).mean().reset_index(0, drop=True)

# Drop first week (where lag is NaN)
weekly_pivot = weekly_pivot.dropna()

# -------------------------------
# Step 4. Prepare data for model
# -------------------------------
X = weekly_pivot[['prev_week', 'trend', 'avg_last3']]
y = weekly_pivot['total_crimes']

# -------------------------------
# Step 5. Train model on full data
# -------------------------------
model = XGBRegressor(
    n_estimators=300,
    learning_rate=0.05,
    max_depth=5,
    subsample=0.9,
    colsample_bytree=0.8,
    random_state=42
)
model.fit(X, y)
print(" Model trained successfully on all data!")

# Save model
joblib.dump(model, "crime_predictor.pkl")
print(" Model saved as crime_predictor.pkl")

# -------------------------------
# Step 6. Predict for next week (Oct 8–14)
# -------------------------------
latest_week = weekly_pivot['week_start'].max()
next_week_start = latest_week + timedelta(days=7)

latest_data = weekly_pivot[weekly_pivot['week_start'] == latest_week].copy()
latest_data['week_start'] = next_week_start  # set to next week

X_pred = latest_data[['prev_week', 'trend', 'avg_last3']]
latest_data['predicted_crimes'] = model.predict(X_pred)

# -------------------------------
# Step 7. Show predictions
# -------------------------------
preds = latest_data[['location', 'predicted_crimes']].sort_values('predicted_crimes', ascending=False)
print("\n Predicted Crimes for Next Week (Oct 8–14, 2025):")
print(preds.head(15))

# Save results
preds.to_csv("next_week_predictions.csv", index=False)
print("\nPredictions saved as next_week_predictions.csv")


# -------------------------------
# Step 8. Sanity check on predictions
# -------------------------------
# Mean predicted value
mean_pred = latest_data['predicted_crimes'].mean()

# Mean of actual crimes from the last week in dataset
mean_actual = weekly_pivot[weekly_pivot['week_start'] == latest_week]['total_crimes'].mean()

print(f"\n Mean actual (last week {latest_week.date()}): {mean_actual:.2f}")
print(f" Mean predicted (next week {next_week_start.date()}): {mean_pred:.2f}")

if mean_pred > mean_actual * 1.3:
    print(" Warning: Model predicts a sharp rise in crime. Check data trends.")
elif mean_pred < mean_actual * 0.7:
    print("Model predicts an unusual drop in crimes. Possible underfit.")
else:
    print(" Predictions look balanced compared to last week.")

