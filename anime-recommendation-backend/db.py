import mysql.connector
from mysql.connector import pooling
import os
from dotenv import load_dotenv

load_dotenv()


# Print environment variables to debug
print("DB_HOST:", os.getenv("DB_HOST"))
print("DB_DATABASE:", os.getenv("DB_DATABASE"))
print("DB_USERNAME:", os.getenv("DB_USERNAME"))
print("DB_PASSWORD:", os.getenv("DB_PASSWORD"))

# Create MySQL connection pool
try:
    db_connection_pool = pooling.MySQLConnectionPool(
        pool_name="anime_pool",
        pool_size=10,
        pool_reset_session=True,
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_DATABASE"),
        user=os.getenv("DB_USERNAME"),
        password=os.getenv("DB_PASSWORD")
    )
except mysql.connector.Error as e:
    print("Error while connecting to MySQL", e)

def get_connection():
    try:
        db_connection = db_connection_pool.get_connection()
        return db_connection
    except mysql.connector.Error as e:
        print("Error while getting database connection:", e)
        return None
