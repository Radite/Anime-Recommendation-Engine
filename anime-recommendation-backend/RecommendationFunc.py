import mysql.connector
from surprise import SVDpp
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

# In ab.py
def retrain_model():
    # Fetch all user ratings from the database
    cnx = connect_to_database()
    cursor = cnx.cursor()

    cursor.execute("SELECT User_ID, Anime_ID, Rating FROM User_Anime")
    user_ratings = cursor.fetchall()

    cursor.close()
    cnx.close()

    # Prepare data for Surprise
    from surprise import Dataset, Reader
    import pandas as pd

    ratings_df = pd.DataFrame(user_ratings, columns=['userID', 'itemID', 'rating'])
    reader = Reader(rating_scale=(1, 10))
    data = Dataset.load_from_df(ratings_df[['userID', 'itemID', 'rating']], reader)

    # Train the SVDpp model
    from surprise import SVDpp
    trainset = data.build_full_trainset()
    model = SVDpp()
    model.fit(trainset)

    # Save the model
    with open('svdpp_model.pkl', 'wb') as f:
        pickle.dump(model, f)

def generate_top_recommendations(user_id, n=9):

    # Load the updated model
    svdpp = load_model('svdpp_model.pkl')

    cnx = connect_to_database()
    cursor = cnx.cursor()

    # Fetch user ratings from the database
    cursor.execute("SELECT Anime_ID, Rating FROM User_Anime WHERE User_ID = %s", (user_id,))
    user_ratings = {anime_id: rating for anime_id, rating in cursor.fetchall()}

    # Initialize list for predicted ratings
    predicted_ratings = []

    # Iterate through anime in the database
    cursor.execute("SELECT Anime_ID, Name, Alternative FROM Anime")
    for anime_id, anime_name, alternative_name in cursor.fetchall():
        if anime_id in user_ratings:
            continue  # Skip if already rated
        svdpp_pred = svdpp.predict(user_id, anime_id).est
        predicted_ratings.append((anime_id, anime_name, svdpp_pred))

    # Sort predicted ratings
    sorted_predictions = sorted(predicted_ratings, key=lambda x: x[2], reverse=True)
    
    cursor.close()
    cnx.close()

    # Log information for debugging
    print("User ratings:", user_ratings)

    return sorted_predictions[:n]

def predict_user_rating(user_id, anime_id):
    cnx = connect_to_database()
    cursor = cnx.cursor()

    # Fetch anime names
    cursor.execute("SELECT Name, Alternative FROM Anime WHERE Anime_ID = %s", (anime_id,))
    anime_name, alternative_name = cursor.fetchone()
    anime_display_name = alternative_name if alternative_name else anime_name
    
    # Load SVDpp model
    svdpp = load_model('svdpp_model.pkl')
    
    # Predict rating for the anime using SVDpp model
    predicted_rating = svdpp.predict(user_id, anime_id).est

    cursor.close()
    cnx.close()

    return predicted_rating, anime_display_name
