import pandas as pd
import mysql.connector

# Connect to MySQL database
connection = mysql.connector.connect(
    host='127.0.0.1',
    database='anime_database',
    user='root',
    password='aaaa'
)

# Read data from Excel file for anime and users
anime_data = pd.read_excel('anime_info.xlsx')
user_data = pd.read_excel('user_info.xlsx')

# Handle missing values for anime data
columns_to_fill = ['Aired', 'Rating', 'Genres', 'Theme', 'Studios', 'Demographic']
for column in columns_to_fill:
    anime_data[column] = anime_data[column].fillna('')  # Replace missing values with empty string

# Handle non-integer values in 'Episodes', 'Duration', and 'Aired' columns for anime data
numeric_columns = ['Episodes', 'Duration', 'Aired']
for column in numeric_columns:
    anime_data[column] = pd.to_numeric(anime_data[column], errors='coerce')
    anime_data[column] = anime_data[column].fillna(0)  # Replace non-integer values with 0

# Insert data into MySQL database for anime data
cursor = connection.cursor()

for index, row in anime_data.iterrows():
    # Insert data into Anime table
    insert_anime_query = """
    INSERT INTO Anime (Anime_ID, Name, Score, Aired, Duration, Episodes, Rating)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    anime_values = (row['Anime_ID'], row['Name'], row['Score'], int(row['Aired']), row['Duration'], row['Episodes'],
                    row['Rating'])
    cursor.execute(insert_anime_query, anime_values)
    anime_id = cursor.lastrowid  # Get the last inserted anime_id

    # Insert data into Anime_Genres table
    genres = row['Genres'].split(',')
    for genre in genres:
        insert_genre_query = """
        INSERT INTO Anime_Genres (Anime_ID, Genre_ID)
        SELECT %s, Genre_ID FROM Genres WHERE GenreName = %s
        """
        genre_values = (anime_id, genre.strip())
        cursor.execute(insert_genre_query, genre_values)

    # Insert data into Anime_Studios table
    studios = row['Studios'].split(',')
    for studio in studios:
        insert_studio_query = """
        INSERT INTO Anime_Studios (Anime_ID, Studio_ID)
        SELECT %s, Studio_ID FROM Studios WHERE StudioName = %s
        """
        studio_values = (anime_id, studio.strip())
        cursor.execute(insert_studio_query, studio_values)

    # Insert data into Anime_Demographics table
    insert_demographic_query = """
    INSERT INTO Anime_Demographics (Anime_ID, Demographic_ID)
    SELECT %s, Demographic_ID FROM Demographics WHERE DemographicName = %s
    """
    demographic_value = (anime_id, row['Demographic'].strip())
    cursor.execute(insert_demographic_query, demographic_value)

# Insert data into MySQL database for user data
for index, row in user_data.iterrows():
    # Insert data into User table
    insert_user_query = """
    INSERT INTO User (User_ID, Age, Gender)
    VALUES (%s, %s, %s)
    """
    user_values = (row['UserID'], row['Min_Age'], 'Male' if row['Gender'] == 1 else 'Female')
    cursor.execute(insert_user_query, user_values)

    # Insert data into User_Anime table
    anime_scores = eval(row['Anime_Scores'])  # Convert string representation of dictionary to dictionary
    for anime, score in anime_scores.items():
        if score != "":  # Skip anime with no rating
            insert_score_query = """
            INSERT INTO User_Anime (User_ID, Anime_ID, Rating)
            SELECT %s, Anime_ID, %s FROM Anime WHERE Name = %s
            """
            score_values = (row['UserID'], float(score), anime)
            cursor.execute(insert_score_query, score_values)

connection.commit()
cursor.close()
connection.close()
