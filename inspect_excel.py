import pandas as pd
import os

file_path = r"c:\Users\adham\Desktop\proprojects\centredappeltvdashboard\Réclamations_Anomalies Suivi (1).xlsx"

try:
    df = pd.read_excel(file_path)
    print("--- Columns ---")
    for col in df.columns:
        print(col)
    
    print("\n--- First 3 Rows ---")
    print(df.head(3).to_string())
    
    # Check for 'Services concernés' column
    if "Services concernés" in df.columns:
        print(f"\nFound 'Services concernés' column.")
        print(f"Unique values: {df['Services concernés'].unique()}")
        
        # Filter for 'Centre d'appel'
        filtered_df = df[df["Services concernés"] == "Centre d'appel"]
        print(f"\nFiltered count (exact match 'Centre d'appel'): {len(filtered_df)}")
        
        # Try finding variants if count is 0
        if len(filtered_df) == 0:
             # Try case insensitive or contains
             mask = df["Services concernés"].astype(str).str.contains("Centre d'appel", case=False, na=False)
             print(f"Filtered count (contains 'Centre d'appel'): {len(df[mask])}")
             print("Sample matches:", df[mask]["Services concernés"].unique())

except Exception as e:
    print(f"Error reading file: {e}")
