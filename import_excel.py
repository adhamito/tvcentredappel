import pandas as pd
import psycopg2
import os
import uuid
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# DB Connection
try:
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        port=os.getenv("DB_PORT", "5432"),
        sslmode=os.getenv("DB_SSLMODE", "require")
    )
    cur = conn.cursor()
    print("Connected to database.")
except Exception as e:
    print(f"Error connecting to database: {e}")
    exit(1)

# File Path
file_path = r"c:\Users\adham\Desktop\proprojects\centredappeltvdashboard\Réclamations_Anomalies Suivi (1).xlsx"

def normalize_text(text):
    if pd.isna(text):
        return ""
    return str(text).strip()

try:
    # Read Excel
    print(f"Reading {file_path}...")
    df = pd.read_excel(file_path)
    
    # Clean column names (strip whitespace)
    df.columns = df.columns.str.strip()
    print("Columns found:", df.columns.tolist())
    
    # Normalize 'Services concernés'
    # The dashboard expects 'Centre d’appel' (curly quote). 
    # Excel has 'Centre d’appel ' (curly quote + space) or potentially straight quotes.
    # We will normalize to what the dashboard expects.
    
    target_service = "Centre d’appel" # This is what the dashboard filters for
    
    # Create a normalized column for filtering
    df['service_normalized'] = df['Services concernés'].apply(lambda x: str(x).strip().replace("'", "’") if pd.notna(x) else "")
    
    # Filter
    # We look for "Centre d’appel" (curly) or "Centre d'appel" (straight) -> normalized to "Centre d’appel"
    filtered_df = df[df['service_normalized'].str.contains("Centre d’appel", case=False)]
    
    print(f"Found {len(filtered_df)} records for Centre d'appel.")
    
    if len(filtered_df) == 0:
        print("No records found. Exiting.")
        exit(0)

    # Get a User ID to link (Create one if doesn't exist)
    cur.execute("SELECT id FROM \"User\" LIMIT 1")
    user_res = cur.fetchone()
    if user_res:
        user_id = user_res[0]
        print(f"Using existing User ID: {user_id}")
    else:
        user_id = str(uuid.uuid4())
        print(f"Creating default User ID: {user_id}")
        cur.execute("""
            INSERT INTO "User" (id, email, password, "updatedAt", role)
            VALUES (%s, %s, %s, NOW(), 'USER')
        """, (user_id, "admin@example.com", "password123"))
        conn.commit()

    # Insert Data
    success_count = 0
    # Create one cursor for all operations or recreate inside if failed
    # Actually, if an error occurs and we rollback, we can continue.
    
    for index, row in filtered_df.iterrows():
        try:
            # Check for column existence safely
            def get_val(col_name, default=""):
                if col_name in row:
                    return normalize_text(row[col_name]) or default
                return default

            rec_id = str(uuid.uuid4())
            date_rec = row['Date'] if 'Date' in row and pd.notna(row['Date']) else datetime.now()
            mode_rec = get_val('Source', "Autre")
            service = target_service # Force the exact string the dashboard expects
            typologie = get_val('Typologie', "Autre")
            title = typologie
            desc = get_val('Description des réclamations/anomalies', "Pas de description")
            officine = get_val('Client', "Inconnu")
            code_client = get_val('Unnamed: 1', "0000")
            ville = get_val('Ville', "Inconnue")
            pharm_resp = "Non spécifié"
            nom_med = "Non spécifié"
            num_lot = "Non spécifié"
            date_perempt = datetime.now() # Dummy
            qte = 0
            
            # Status mapping
            etat = get_val('Etat').lower()
            if "résolu" in etat or "resolu" in etat:
                status = "CLOSED" 
                cloture = True
            else:
                status = "OPEN"
                cloture = False
                
            actions = get_val('Actions')
            prev_actions = get_val('Procedure MAJ / preventions recurrence')
            
            # Insert
            cur.execute("""
                INSERT INTO "reclamations" (
                    id, "dateReclamation", "modeReception", "serviceConcerne", typologie, 
                    title, description, "nomOfficine", "codeClient", ville, 
                    "pharmacienResponsable", "nomMedicament", "numeroLot", "datePeremption", 
                    "quantiteConcernee", "userId", "updatedAt", "createdAt", 
                    status, cloture, "actionsImmediates", "actionsPreventives"
                ) VALUES (
                    %s, %s, %s, %s, %s, 
                    %s, %s, %s, %s, %s, 
                    %s, %s, %s, %s, 
                    %s, %s, NOW(), NOW(), 
                    %s, %s, %s, %s
                )
            """, (
                rec_id, date_rec, mode_rec, service, typologie,
                title, desc, officine, code_client, ville,
                pharm_resp, nom_med, num_lot, date_perempt,
                qte, user_id,
                status, cloture, actions, prev_actions
            ))
            conn.commit() # Commit each row to ensure success
            success_count += 1
            
        except Exception as e:
            print(f"Error inserting row {index}: {e}")
            conn.rollback()
            continue

    print(f"Successfully imported {success_count} records.")

except Exception as e:
    print(f"Global error: {e}")
finally:
    if conn:
        conn.close()
