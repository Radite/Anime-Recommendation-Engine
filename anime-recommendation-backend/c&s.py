import pandas as pd
import pickle
import json
from db import get_connection

# Load the anime data and the model
anime_df = pd.read_excel('anime_info.xlsx')  # Adjust the path to your anime data Excel file
with open('svdpp_model.pkl', 'rb') as f:
    recommendation_model = pickle.load(f)

# Define the recommendation function
def recommend_anime(anime_id, anime_df, top_n=99):
    # Filter anime by anime_id
    target_anime = anime_df[anime_df['Anime_ID'] == anime_id].iloc[0]
    
    # Extract relevant information
    target_names = [target_anime['Name']] + ([target_anime['Alternative']] if isinstance(target_anime['Alternative'], str) else [])
    target_genres = target_anime['Genres'].split(', ') if isinstance(target_anime['Genres'], str) else []
    target_demographic = target_anime['Demographic']
    target_rating = target_anime['Rating']
    target_theme = target_anime['Theme']
    target_score = target_anime['Score']
    
    # Initialize recommendation list
    recommendations = []
    
    # Iterate through anime
    for index, anime_row in anime_df.iterrows():
        if anime_row['Anime_ID'] != anime_id:  # Skip the target anime itself
            # Extract anime information
            anime_names = [anime_row['Name']] + ([anime_row['Alternative']] if isinstance(anime_row['Alternative'], str) else [])
            anime_genres = anime_row['Genres'].split(', ') if isinstance(anime_row['Genres'], str) else []
            anime_demographic = anime_row['Demographic']
            anime_rating = anime_row['Rating']
            anime_theme = anime_row['Theme']
            anime_score = anime_row['Score']
            
            # Calculate similarity score based on matching criteria
            similarity_score = 0
            
            # Matching names
            for name in target_names:
                if name in anime_names:
                    similarity_score += 5
                    
            # Matching genres
            for genre in target_genres:
                if genre in anime_genres:
                    similarity_score += 3
                    
            # Matching demographic
            if anime_demographic == target_demographic:
                similarity_score += 5
                
            # Matching rating
            if anime_rating == target_rating:
                similarity_score += 4
                
            # Matching theme
            if anime_theme == target_theme:
                similarity_score += 3
                
            # Add additional score based on anime's score
            similarity_score += anime_score
            
            # Scale the similarity score
            scaled_score = similarity_score
            
            # If the similarity score is 30 or above, scale it to 100
            if scaled_score >= 30:
                scaled_score = 100
            else:
                # Scale the similarity score proportionally
                scaled_score = (scaled_score / 30) * 100
            
            # Add recommendation to the list
            recommendations.append((anime_row['Anime_ID'], scaled_score))
    
    # Sort recommendations based on similarity score
    recommendations.sort(key=lambda x: x[1], reverse=True)
    
    # Return top N recommendations with anime IDs and scores
    return recommendations[:top_n]

# Function to save similarity scores to the database
def save_similarity_scores(anime_id, recommendations, cursor):
    insert_query = """
    INSERT INTO similarityscores (ANIME_ID, AnimeREF, SIMILARITYSCORE)
    VALUES (%s, %s, %s)
    """
    for recommendation in recommendations:
        cursor.execute(insert_query, (anime_id, recommendation[0], recommendation[1]))

# Get database connection
db_connection = get_connection()

if db_connection:
    cursor = db_connection.cursor()

    try:
        for anime_id in range(1, 9957):
            # Get recommendations
            recommendations = recommend_anime(anime_id, anime_df)
            
            # Save recommendations to database
            save_similarity_scores(anime_id, recommendations, cursor)
        
        # Commit the transaction
        db_connection.commit()
    except Exception as e:
        print("Error:", e)
        db_connection.rollback()
    finally:
        cursor.close()
        db_connection.close()
else:
    print("Database connection failed.")
