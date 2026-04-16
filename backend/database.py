import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

def get_connection():
    return psycopg2.connect(
        host="db",
        port=5432,
        dbname="multiagent",
        user="user",
        password="password"
    )

def setup_database():
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS pipeline_runs (
            id SERIAL PRIMARY KEY,
            user_input TEXT NOT NULL,
            research TEXT,
            plan TEXT,
            code TEXT,
            validation TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    conn.commit()
    cursor.close()
    conn.close()
    print("✅ Database table ready!")

def save_run(user_input, research, plan, code, validation):
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT INTO pipeline_runs (user_input, research, plan, code, validation)
        VALUES (%s, %s, %s, %s, %s)
    """, (user_input, research, plan, code, validation))
    
    conn.commit()
    cursor.close()
    conn.close()
    print("✅ Run saved to database!")