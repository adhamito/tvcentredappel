# Centre d'Appel Analytics Dashboard

This is a TV-ready dashboard built with [Streamlit](https://streamlit.io/) to visualize Call Center analytics.

## Features

- **Typologie**: Call categorization breakdown.
- **Performance par Ville**: Geographic distribution of calls.
- **CA par Collaboratrice**: Revenue/Performance per agent.
- **Pharmacie & Taux de Résolution**: Key Performance Indicators for pharmacies.
- **Auto-connection**: Automatically connects to your Neon PostgreSQL database if configured.
- **Mock Data Mode**: Falls back to demonstration data if no database connection is found.

## Setup

1.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

2.  **Configure Database**:
    - Rename `.env.example` to `.env`.
    - Fill in your Neon PostgreSQL credentials in `.env`.

    ```env
    DB_HOST=your_host_url.neon.tech
    DB_NAME=your_database_name
    DB_USER=your_username
    DB_PASSWORD=your_password
    DB_PORT=5432
    ```

3.  **Run the Dashboard**:
    ```bash
    streamlit run app.py
    ```

## Deployment

To deploy this on a TV screen:
1.  Run the app on a local server or deploy to Streamlit Cloud/Heroku.
2.  Open the URL in the TV's browser.
3.  Press `F11` for Full Screen mode.
