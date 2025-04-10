# # from flask import Flask, jsonify
# # import pyreadstat
# # import os
# # import pandas as pd

# # app = Flask(__name__)

# # sav_file = os.path.join(os.path.dirname(__file__), "recommender.sav")

# # try:
# #     df, meta = pyreadstat.read_sav(sav_file)
# #     # Convert DataFrame to dictionary: {user_id: [list of titles]}
# #     recommendations_lookup = df.groupby('user_id')['title'].apply(list).to_dict()
# #     print("Loaded recommender.sav successfully:")
# #     print(recommendations_lookup)
# # except Exception as e:
# #     recommendations_lookup = {}
# #     print("Error loading sav file:", e)

# # @app.route('/api/recommendations/<user_id>', methods=['GET'])
# # def get_recommendations(user_id):
# #     user_id_str = str(user_id)
# #     recommendations = recommendations_lookup.get(user_id_str, [])
# #     return jsonify({"user_id": user_id_str, "recommendations": recommendations})

# # if __name__ == '__main__':
# #     app.run(debug=True, host='0.0.0.0', port=5000)

# import sqlite3
# from flask import Flask, jsonify
# from flask_cors import CORS
# import os

# app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes

# def get_recommended_movie_ids(user_id):
#     # Replace this dummy logic with your actual recommendation model.
#     # For now, we'll return sample movie IDs.
#     return ["s1", "s2", "s3"]

# def get_movie_details_from_db(movie_ids):
#     """
#     Connects to the SQLite database (movies.db) located one level up,
#     queries the movies_titles table for the given movie_ids, and returns
#     a list of dictionaries containing movie details.
#     """
#     # Adjust the database path: move one level up from the current file location.
#     db_path = os.path.join(os.path.dirname(__file__), "..", "movies.db")
#     db_path = os.path.abspath(db_path)
    
#     connection = sqlite3.connect(db_path)
#     connection.row_factory = sqlite3.Row  # Allows access to columns by name
#     cursor = connection.cursor()
    
#     # Create placeholders (e.g., "?, ?, ?") for the number of movie_ids.
#     placeholders = ','.join('?' for _ in movie_ids)
#     query = f"SELECT * FROM movies_titles WHERE show_id IN ({placeholders})"
    
#     cursor.execute(query, movie_ids)
#     rows = cursor.fetchall()
#     movies = [dict(row) for row in rows]
    
#     connection.close()
#     return movies

# def transform_movie(movie):
#     """
#     Takes a movie dictionary from the database and returns a new dictionary
#     with keys matching your React TSX expectation.
#     Assumes your database returns columns with keys:
#       - show_id, title, description, duration, rating, release_year
#     """
#     return {
#         "movieId": movie.get("show_id"),             # Rename show_id to movieId
#         "title": movie.get("title"),
#         "description": movie.get("description"),
#         "duration": movie.get("duration"),
#         "rating": movie.get("rating"),
#         "year": movie.get("release_year"),           # Rename release_year to year
#         "averageRating": 3.5,                          # Placeholder value (adjust if you compute real averages)
#         # If you need to pass additional fields you can do so here as well.
#     }

# @app.route("/api/recommendations/<user_id>", methods=["GET"])
# def recommendations(user_id):
#     # Get recommended movie IDs for the given user.
#     recommended_ids = get_recommended_movie_ids(user_id)
    
#     # Retrieve detailed movie records from the SQLite database.
#     raw_movies = get_movie_details_from_db(recommended_ids)
    
#     # Transform the raw movie details into the format required by your React component.
#     transformed_movies = [transform_movie(movie) for movie in raw_movies]
    
#     # Return the transformed movies as JSON.
#     return jsonify({"recommendedMovies": transformed_movies})

# if __name__ == "__main__":
#     app.run(debug=True, port=5001)

import os
import sqlite3
from flask import Flask, jsonify
from flask_cors import CORS
import pyreadstat

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# --- Step 1: Load the .sav file and create a lookup dictionary ---
# Path to your .sav file (assumed to be in the same directory as this script)
sav_file = os.path.join(os.path.dirname(__file__), "recommender.sav")

try:
    # Read the .sav file. This returns a DataFrame (df) and metadata.
    df, meta = pyreadstat.read_sav(sav_file)
    # Group by user_id and get the list of recommended movie titles per user.
    recommendations_lookup = df.groupby('user_id')['title'].apply(list).to_dict()
    print("Loaded recommender.sav successfully:")
    print(recommendations_lookup)
except Exception as e:
    recommendations_lookup = {}
    print("Error loading sav file:", e)

def get_recommended_movie_titles(user_id):
    """
    Given a user_id, returns a list of recommended movie titles based on the .sav data.
    """
    user_id_str = str(user_id)
    return recommendations_lookup.get(user_id_str, [])

# --- Step 2: Query the SQLite database for movie details based on titles ---

def get_movie_details_by_titles(titles):
    """
    Connects to the SQLite database (movies.db) located one level up (the backend root),
    queries the movies_titles table for movies whose title is in the provided list,
    and returns a list of dictionaries containing movie details.
    """
    db_path = os.path.join(os.path.dirname(__file__), "..", "movies.db")
    db_path = os.path.abspath(db_path)
    
    connection = sqlite3.connect(db_path)
    connection.row_factory = sqlite3.Row  # Allows us to access columns by name
    cursor = connection.cursor()
    
    # Build a comma-separated list of placeholders (e.g., "?, ?, ?")
    placeholders = ','.join('?' for _ in titles)
    query = f"SELECT * FROM movies_titles WHERE title IN ({placeholders})"
    
    cursor.execute(query, titles)
    rows = cursor.fetchall()
    movies = [dict(row) for row in rows]
    
    connection.close()
    return movies

# --- Step 3: Transform database results to match your frontend's data structure ---

def transform_movie(movie):
    """
    Transforms a raw movie dictionary from the database into a dictionary that matches your React TSX expectations.
    Assumes the database returns columns named:
      - show_id, title, description, duration, rating, release_year
    """
    return {
        "movieId": movie.get("show_id"),       # Rename show_id to movieId
        "title": movie.get("title"),
        "description": movie.get("description"),
        "duration": movie.get("duration"),
        "rating": movie.get("rating"),
        "year": movie.get("release_year"),     # Rename release_year to year
        "averageRating": 3.5                     # Placeholder value (update if computed elsewhere)
    }

# --- Step 4: Define your API endpoint ---

@app.route("/api/recommendations/<user_id>", methods=["GET"])
def recommendations(user_id):
    # 1. Get the list of recommended movie titles for the given user_id.
    recommended_titles = get_recommended_movie_titles(user_id)
    
    # 2. If there are recommendations, get the detailed movie records from the database.
    if recommended_titles:
        raw_movies = get_movie_details_by_titles(recommended_titles)
    else:
        raw_movies = []
    
    # 3. Transform the raw records to the format expected by your frontend.
    transformed_movies = [transform_movie(movie) for movie in raw_movies]
    
    # 4. Return the transformed movies as JSON.
    return jsonify({"recommendedMovies": transformed_movies})

if __name__ == "__main__":
    app.run(debug=True, port=5001)

