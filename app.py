import streamlit as st
import pandas as pd
import plotly.express as px
import os
import psycopg2
from dotenv import load_dotenv
import time

# Load environment variables
load_dotenv()

# Page Configuration
st.set_page_config(
    page_title="Centre d'Appel Analytics",
    page_icon="📞",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# --- Database Connection & Data Fetching ---

def get_db_connection():
    """Establishes a connection to the PostgreSQL database."""
    try:
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST"),
            database=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            port=os.getenv("DB_PORT", "5432"),
            sslmode=os.getenv("DB_SSLMODE", "require")
        )
        return conn
    except Exception as e:
        return None

@st.cache_data(ttl=60)  # Cache data for 60 seconds to avoid frequent DB hits
def fetch_data():
    """Fetches data from the database or returns mock data if connection fails."""
    conn = get_db_connection()
    
    if conn:
        try:
            # 1. Typologie (Call Categorization)
            query_typologie = """
                SELECT typologie, COUNT(*) as total 
                FROM "Reclamation" 
                WHERE "serviceConcerne" = 'Centre d’appel' 
                GROUP BY typologie 
                ORDER BY total DESC;
            """
            df_typologie = pd.read_sql(query_typologie, conn)

            # 2. Performance par Ville (Location Stats)
            query_ville = """
                SELECT ville, COUNT(*) as total
                FROM "Reclamation"
                WHERE "serviceConcerne" = 'Centre d’appel'
                GROUP BY ville
                ORDER BY total DESC
                LIMIT 10;
            """
            df_ville = pd.read_sql(query_ville, conn)

            # 3. CA par Collaboratrice (Revenue/Performance per Agent)
            # Joining with User table to get agent names
            query_agent = """
                SELECT u.name as agent_name, COUNT(r.id) as total_ca
                FROM "Reclamation" r
                LEFT JOIN "User" u ON r."userId" = u.id
                WHERE r."serviceConcerne" = 'Centre d’appel'
                GROUP BY u.name
                ORDER BY total_ca DESC;
            """
            df_agent = pd.read_sql(query_agent, conn)

            # 4. Pharmacie & Taux de Résolution (KPI Table)
            # Using 'nomOfficine' for pharmacy name
            # Calculating resolution rate based on 'cloture' boolean (True = Resolved)
            query_pharmacie = """
                SELECT 
                    "nomOfficine" as pharmacie_name, 
                    COUNT(*) as total_calls,
                    ROUND(CAST(SUM(CASE WHEN cloture = true THEN 1 ELSE 0 END) AS NUMERIC) / COUNT(*) * 100, 2) as resolution_rate
                FROM "Reclamation"
                WHERE "serviceConcerne" = 'Centre d’appel'
                GROUP BY "nomOfficine"
                ORDER BY total_calls DESC
                LIMIT 10;
            """

            # Note: The above query assumes columns like 'pharmacie_name' and 'status'. 
            # If these don't exist, this part will fail, so we might need robust error handling or mock fallback.
            try:
                df_pharmacie = pd.read_sql(query_pharmacie, conn)
            except Exception:
                # Fallback if specific columns for pharmacie query don't exist
                df_pharmacie = pd.DataFrame(columns=['pharmacie_name', 'total_calls', 'resolution_rate'])

            conn.close()
            return (df_typologie, df_ville, df_agent, df_pharmacie), True

        except Exception as e:
            st.error(f"Error executing queries: {e}")
            if conn:
                conn.close()
            return generate_mock_data(), False
    else:
        return generate_mock_data(), False

def generate_mock_data():
    """Generates mock data for demonstration purposes."""
    # 1. Typologie
    data_typologie = {
        'typologie': ['Appels sortant', 'Appels entrant', 'Réclamation', 'Information', 'Suivi de commande'],
        'total': [150, 120, 45, 30, 80]
    }
    df_typologie = pd.DataFrame(data_typologie)

    # 2. Performance par Ville
    data_ville = {
        'ville': ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir'],
        'total': [200, 150, 100, 80, 60, 40]
    }
    df_ville = pd.DataFrame(data_ville)

    # 3. CA par Collaboratrice
    data_agent = {
        'agent_name': ['Fatima', 'Hijar', 'Souad', 'Amina', 'Khadija'],
        'total_ca': [50000, 45000, 48000, 30000, 35000]
    }
    df_agent = pd.DataFrame(data_agent)

    # 4. Pharmacie & Taux de Résolution
    data_pharmacie = {
        'pharmacie_name': ['Pharmacie Centrale', 'Pharmacie Al Amal', 'Pharmacie Ibn Sina', 'Pharmacie Atlas', 'Pharmacie Ocean'],
        'total_calls': [50, 45, 40, 35, 30],
        'resolution_rate': [95.5, 88.0, 92.3, 85.0, 90.1]
    }
    df_pharmacie = pd.DataFrame(data_pharmacie)
    
    return df_typologie, df_ville, df_agent, df_pharmacie

# --- Main Dashboard Layout ---

def main():
    st.markdown("""
        <style>
        .block-container {
            padding-top: 2rem;
            padding-bottom: 2rem;
        }
        h1 {
            color: #2E86C1;
            text-align: center;
            margin-bottom: 2rem;
        }
        h3 {
            color: #5D6D7E;
            margin-bottom: 1rem;
        }
        </style>
    """, unsafe_allow_html=True)

    st.title("📞 Centre d'Appel Analytics")

    # Fetch Data
    (df_typologie, df_ville, df_agent, df_pharmacie), is_real_data = fetch_data()

    if not is_real_data:
        st.warning("⚠️ Displaying MOCK DATA. Configure `.env` with valid database credentials to see real data.")

    # Top Row: Typologie & Performance par Ville
    col1, col2 = st.columns(2)

    with col1:
        st.subheader("1. Typologie (Call Categorization)")
        if not df_typologie.empty:
            fig_typologie = px.bar(
                df_typologie, 
                x='total', 
                y='typologie', 
                orientation='h',
                text='total',
                color='total',
                color_continuous_scale='Blues',
                labels={'total': 'Count', 'typologie': 'Call Type'},
                template='plotly_white'
            )
            fig_typologie.update_layout(showlegend=False, yaxis={'categoryorder':'total ascending'})
            st.plotly_chart(fig_typologie, use_container_width=True)
        else:
            st.info("No data available for Typologie.")

    with col2:
        st.subheader("2. Performance par Ville (Location Stats)")
        if not df_ville.empty:
            fig_ville = px.bar(
                df_ville, 
                x='total', 
                y='ville', 
                orientation='h',
                text='total',
                color='total',
                color_continuous_scale='Greens',
                labels={'total': 'Count', 'ville': 'City'},
                template='plotly_white'
            )
            fig_ville.update_layout(showlegend=False, yaxis={'categoryorder':'total ascending'})
            st.plotly_chart(fig_ville, use_container_width=True)
        else:
            st.info("No data available for Location Stats.")

    # Middle Row: CA par Collaboratrice
    st.markdown("---")
    st.subheader("3. CA par Collaboratrice (Revenue/Performance per Agent)")
    
    if not df_agent.empty:
        fig_agent = px.bar(
            df_agent, 
            x='agent_name', 
            y='total_ca', 
            text='total_ca',
            color='agent_name',
            color_discrete_sequence=px.colors.qualitative.Pastel,
            labels={'total_ca': 'Total Turnover (DH)', 'agent_name': 'Agent Name'},
            template='plotly_white'
        )

        fig_agent.update_traces(texttemplate='%{text:.2s}', textposition='outside')
        fig_agent.update_layout(showlegend=False, xaxis_title=None)
        st.plotly_chart(fig_agent, use_container_width=True)
    else:
        st.info("No data available for Agent Performance.")

    # Bottom Row: Pharmacie & Taux de Résolution
    st.markdown("---")
    st.subheader("4. Pharmacie & Taux de Résolution (KPI Table)")

    if not df_pharmacie.empty:
        # Display as a styled dataframe or metrics
        # Option 1: Dataframe with formatting
        st.dataframe(
            df_pharmacie.style.format({
                'resolution_rate': '{:.1f}%'
            }).background_gradient(subset=['resolution_rate'], cmap='RdYlGn'),
            use_container_width=True
        )
        
        # Option 2: Summary Cards (if few items) - optional, sticking to table as requested
    else:
        st.info("No data available for Pharmacy KPIs.")

    # Auto-refresh logic (Optional: Add a button to manually refresh or use st.empty for loop)
    # Since this is a dashboard, a manual refresh button is good practice.
    if st.button("Refresh Data"):
        st.cache_data.clear()
        st.rerun()

if __name__ == "__main__":
    main()
