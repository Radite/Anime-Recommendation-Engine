import pickle
import sys
import json
from db import get_connection

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

# Define the recommendation function
def recommend_anime(anime_id, db_connection, top_n=99):
    cursor = db_connection.cursor(dictionary=True)

    cursor.execute("SELECT * FROM Anime WHERE Anime_ID = %s", (anime_id,))
    target_anime = cursor.fetchone()

    if not target_anime:
        return []

    target_genres = get_anime_genres(anime_id, cursor)
    target_demographic = get_anime_demographic(anime_id, cursor)
    target_rating = target_anime['Rating']
    target_themes = get_anime_themes(anime_id, cursor)  # Get themes of the target anime
    target_score = target_anime['Score']

    recommendations = []

    cursor.execute("SELECT * FROM Anime")
    all_anime = cursor.fetchall()

    for anime_row in all_anime:
        if anime_row['Anime_ID'] != anime_id:
            anime_genres = get_anime_genres(anime_row['Anime_ID'], cursor)
            anime_demographic = get_anime_demographic(anime_row['Anime_ID'], cursor)
            anime_rating = anime_row['Rating']
            anime_themes = get_anime_themes(anime_row['Anime_ID'], cursor)  # Get themes of the current anime
            anime_score = anime_row['Score']

            similarity_score = 0

            for genre_id in target_genres:
                if genre_id in anime_genres:
                    similarity_score += 3

            if anime_demographic == target_demographic:
                similarity_score += 5

            if anime_rating == target_rating:
                similarity_score += 4

            # Matching themes
            for theme_id in target_themes:
                if theme_id in anime_themes:
                    similarity_score += 3

            similarity_score += anime_score

            scaled_score = similarity_score

            if scaled_score >= 30:
                scaled_score = 100
            else:
                scaled_score = (scaled_score / 30) * 100

            recommendations.append((anime_row['Anime_ID'], scaled_score))

    recommendations.sort(key=lambda x: x[1], reverse=True)

    cursor.close()
    db_connection.close()

    return recommendations[:top_n]

# Get database connection
db_connection = get_connection()

if db_connection:
    # Get anime ID from command-line arguments
    anime_id = int(sys.argv[1])

    # Call the recommendation function
    recommendations = recommend_anime(anime_id, db_connection)

    # Output recommendations as JSON
    print(json.dumps(recommendations))
else:
    print("Database connection failed.")

