# test_recommendation.py
import sys
import json
from db import get_connection
from recommendation import recommend_anime  # Assuming the main code is in recommend_anime.py

def main():
    if len(sys.argv) < 2:
        print("Usage: python test_recommendation.py <anime_id>")
        return

    anime_id = int(sys.argv[1])
    db_connection = get_connection()

    if db_connection:
        recommendations = recommend_anime(anime_id, db_connection)
        print(json.dumps(recommendations, indent=2))
    else:
        print("Database connection failed.")

if __name__ == "__main__":
    main()
