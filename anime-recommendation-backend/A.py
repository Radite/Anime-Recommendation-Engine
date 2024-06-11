import mysql.connector
import json
import pickle

def connect_to_database():
    return mysql.connector.connect(
        host='127.0.0.1',
        database='anime_database',
        user='root',
        password='aaaa'
    )

def load_model(model_path):
    with open(model_path, 'rb') as f:
        return pickle.load(f)

def generate_top_recommendations(user_id, n=10):
    cnx = connect_to_database()
    cursor = cnx.cursor()

    # Fetch user ratings from the database
    cursor.execute("SELECT Anime_ID, Rating FROM User_Anime WHERE User_ID = %s", (user_id,))
    user_ratings = {anime_id: rating for anime_id, rating in cursor.fetchall()}

    # Load models
    svdpp = load_model('svdpp_model.pkl')

    # Initialize list for predicted ratings
    predicted_ratings = []

    # Iterate through anime in the database
    cursor.execute("SELECT Anime_ID, Name, Alternative FROM Anime")
    for anime_id, anime_name, alternative_name in cursor.fetchall():
        if anime_id in user_ratings:
            continue  # Skip if already rated
        svdpp_pred = svdpp.predict(user_id, anime_id).est
        predicted_ratings.append({'anime': anime_name, 'rating': svdpp_pred})

    # Sort predicted ratings
    sorted_predictions = sorted(predicted_ratings, key=lambda x: x['rating'], reverse=True)
    
    cursor.close()
    cnx.close()

    return sorted_predictions[:n]

def predict_user_rating(user_id, anime_id):
    cnx = connect_to_database()
    cursor = cnx.cursor()

    # Fetch anime name
    cursor.execute("SELECT Name, Alternative FROM Anime WHERE Anime_ID = %s", (anime_id,))
    anime_name, alternative_name = cursor.fetchone()
    anime_display_name = alternative_name if alternative_name else anime_name
    
    # Predict rating for the anime using SVDpp model
    svdpp = load_model('svdpp_model.pkl')
    predicted_rating = svdpp.predict(user_id, anime_id).est

    cursor.close()
    cnx.close()

    return {'anime': anime_display_name, 'predicted_rating': predicted_rating}

# Example usage:
user_id = 3  # Replace with the desired user ID
top_recommendations = generate_top_recommendations(user_id, n=10)
print(json.dumps(top_recommendations))

anime_id = 117  # Anime_ID for "Sousou no Frieren"
predicted_rating = predict_user_rating(user_id, anime_id)
print(json.dumps(predicted_rating))
