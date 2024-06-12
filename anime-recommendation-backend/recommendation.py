import json
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from db import get_connection  # Assuming you have a function get_connection that returns a database connection
import pymysql  # Import your database library here

# Define a function to get genres of an anime
def get_anime_genres(anime_id, cursor):
    cursor.execute("SELECT Genre_ID FROM Anime_Genres WHERE Anime_ID = %s", (anime_id,))
    genres = [row['Genre_ID'] for row in cursor.fetchall()]
    return genres

# Define a function to get demographic of an anime
def get_anime_demographic(anime_id, cursor):
    cursor.execute("SELECT Demographic_ID FROM Anime_Demographics WHERE Anime_ID = %s", (anime_id,))
    demographic_id = cursor.fetchone()
    if demographic_id:
        cursor.execute("SELECT DemographicName FROM Demographics WHERE Demographic_ID = %s", (demographic_id['Demographic_ID'],))
        demographic = cursor.fetchone()
        if demographic:
            return demographic['DemographicName']
    return None

# Define a function to get themes of an anime
def get_anime_themes(anime_id, cursor):
    cursor.execute("SELECT Theme_ID FROM Anime_Themes WHERE Anime_ID = %s", (anime_id,))
    themes = [row['Theme_ID'] for row in cursor.fetchall()]
    return themes

# Define a function to get studios of an anime
def get_anime_studios(anime_id, cursor):
    cursor.execute("SELECT Studio_ID FROM Anime_Studios WHERE Anime_ID = %s", (anime_id,))
    studios = [row['Studio_ID'] for row in cursor.fetchall()]
    return studios

# Calculate cosine similarity
def cosine_similarity(a, b):
    dot_product = np.dot(a, b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    return dot_product / (norm_a * norm_b)

# Define the recommendation function
def recommend_anime(anime_id, db_connection, cursor):
    cursor.execute("SELECT * FROM Anime WHERE Anime_ID = %s", (anime_id,))
    target_anime = cursor.fetchone()

    if not target_anime:
        return []

    target_genres = get_anime_genres(anime_id, cursor)
    target_demographic = get_anime_demographic(anime_id, cursor)
    target_themes = get_anime_themes(anime_id, cursor)
    target_studios = get_anime_studios(anime_id, cursor)
    target_score = target_anime['Score']
    target_episodes = target_anime['Episodes']
    target_duration = target_anime['Duration']
    target_rating = target_anime['Rating']  # Fetching the Rating field

    recommendations = []

    cursor.execute("SELECT * FROM Anime")
    all_anime = cursor.fetchall()

    # Normalize score, episodes, and duration
    scores = [anime['Score'] for anime in all_anime]
    episodes = [anime['Episodes'] for anime in all_anime]
    durations = [anime['Duration'] for anime in all_anime]
    
    scaler = MinMaxScaler()
    scores_normalized = scaler.fit_transform(np.array(scores).reshape(-1, 1)).flatten()
    episodes_normalized = scaler.fit_transform(np.array(episodes).reshape(-1, 1)).flatten()
    durations_normalized = scaler.fit_transform(np.array(durations).reshape(-1, 1)).flatten()

    similarity_scores = []

    for idx, anime_row in enumerate(all_anime):
        if anime_row['Anime_ID'] != anime_id:
            anime_genres = get_anime_genres(anime_row['Anime_ID'], cursor)
            anime_demographic = get_anime_demographic(anime_row['Anime_ID'], cursor)
            anime_themes = get_anime_themes(anime_row['Anime_ID'], cursor)
            anime_studios = get_anime_studios(anime_row['Anime_ID'], cursor)
            anime_score = scores_normalized[idx]
            anime_episodes = episodes_normalized[idx]
            anime_duration = durations_normalized[idx]

            # Fetch the anime rating without normalization
            anime_rating = anime_row['Rating']

            # Calculate similarity for genres, themes, studios, and rating
            genre_similarity = len(set(target_genres) & set(anime_genres)) / len(set(target_genres) | set(anime_genres)) if len(set(target_genres) | set(anime_genres)) > 0 else 0
            theme_similarity = len(set(target_themes) & set(anime_themes)) / len(set(target_themes) | set(anime_themes)) if len(set(target_themes) | set(anime_themes)) > 0 else 0
            studio_similarity = len(set(target_studios) & set(anime_studios)) / len(set(target_studios) | set(anime_studios)) if len(set(target_studios) | set(anime_studios)) > 0 else 0
            rating_similarity = 1 if anime_rating == target_rating else 0

            # Calculate demographic similarity
            demographic_similarity = 1 if anime_demographic == target_demographic else 0

            # Combine similarities using weights
            similarity_score = (0.4 * genre_similarity +
                                0.2 * theme_similarity +
                                0.1 * studio_similarity +
                                0.2 * demographic_similarity +
                                0.1 * rating_similarity +
                                0.1 * anime_score)

            similarity_scores.append((anime_id, anime_row['Anime_ID'], similarity_score))

    return similarity_scores

# Main function to compute and store similarity scores
def main():
    db_connection = get_connection()  # Replace with your function to get database connection
    if not db_connection:
        print("Database connection failed.")
        return

    cursor = db_connection.cursor(dictionary=True)

    # Clear existing data in similarityscores table (optional)
    cursor.execute("TRUNCATE TABLE similarityscores")

    try:
        for anime_id in range(1, 1000):  # Adjust the range based on your anime IDs
            similarity_scores = recommend_anime(anime_id, db_connection, cursor)
            # Batch insert similarity scores
            cursor.executemany("INSERT INTO similarityscores (Anime_ID, AnimeREF, SIMILARITYSCORE) VALUES (%s, %s, %s)", similarity_scores)
            db_connection.commit()
            print(f"Processed Anime_ID {anime_id}")
    except Exception as e:
        print(f"Error: {e}")
        db_connection.rollback()

    cursor.close()
    db_connection.close()

if __name__ == "__main__":
    main()
