
# # import os
# # import sqlite3
# # from flask import Flask, jsonify
# # from flask_cors import CORS
# # import pyreadstat

# # app = Flask(__name__)
# # CORS(app)  # Enable CORS for all routes

# # # --- Step 1: Load the .sav file and create a lookup dictionary ---
# # # Path to your .sav file (assumed to be in the same directory as this script)
# # sav_file = os.path.join(os.path.dirname(__file__), "recommender.sav")

# # try:
# #     # Read the .sav file. This returns a DataFrame (df) and metadata.
# #     df, meta = pyreadstat.read_sav(sav_file)
# #     # Group by user_id and get the list of recommended movie titles per user.
# #     recommendations_lookup = df.groupby('user_id')['title'].apply(list).to_dict()
# #     print("Loaded recommender.sav successfully:")
# #     print(recommendations_lookup)
# # except Exception as e:
# #     recommendations_lookup = {}
# #     print("Error loading sav file:", e)

# # def get_recommended_movie_titles(user_id):
# #     """
# #     Given a user_id, returns a list of recommended movie titles based on the .sav data.
# #     """
# #     user_id_str = str(user_id)
# #     return recommendations_lookup.get(user_id_str, [])

# # # --- Step 2: Query the SQLite database for movie details based on titles ---

# # def get_movie_details_by_titles(titles):
# #     """
# #     Connects to the SQLite database (movies.db) located one level up (the backend root),
# #     queries the movies_titles table for movies whose title is in the provided list,
# #     and returns a list of dictionaries containing movie details.
# #     """
# #     db_path = os.path.join(os.path.dirname(__file__), "..", "movies.db")
# #     db_path = os.path.abspath(db_path)
    
# #     connection = sqlite3.connect(db_path)
# #     connection.row_factory = sqlite3.Row  # Allows us to access columns by name
# #     cursor = connection.cursor()
    
# #     # Build a comma-separated list of placeholders (e.g., "?, ?, ?")
# #     placeholders = ','.join('?' for _ in titles)
# #     query = f"SELECT * FROM movies_titles WHERE title IN ({placeholders})"
    
# #     cursor.execute(query, titles)
# #     rows = cursor.fetchall()
# #     movies = [dict(row) for row in rows]
    
# #     connection.close()
# #     return movies

# # # --- Step 3: Transform database results to match your frontend's data structure ---

# # def transform_movie(movie):
# #     """
# #     Transforms a raw movie dictionary from the database into a dictionary that matches your React TSX expectations.
# #     Assumes the database returns columns named:
# #       - show_id, title, description, duration, rating, release_year
# #     """
# #     return {
# #         "movieId": movie.get("show_id"),       # Rename show_id to movieId
# #         "title": movie.get("title"),
# #         "description": movie.get("description"),
# #         "duration": movie.get("duration"),
# #         "rating": movie.get("rating"),
# #         "year": movie.get("release_year"),     # Rename release_year to year
# #         "averageRating": 3.5                     # Placeholder value (update if computed elsewhere)
# #     }

# # # --- Step 4: Define your API endpoint ---

# # @app.route("/api/recommendations/<user_id>", methods=["GET"])
# # def recommendations(user_id):
# #     # 1. Get the list of recommended movie titles for the given user_id.
# #     recommended_titles = get_recommended_movie_titles(user_id)
    
# #     # 2. If there are recommendations, get the detailed movie records from the database.
# #     if recommended_titles:
# #         raw_movies = get_movie_details_by_titles(recommended_titles)
# #     else:
# #         raw_movies = []
    
# #     # 3. Transform the raw records to the format expected by your frontend.
# #     transformed_movies = [transform_movie(movie) for movie in raw_movies]
    
# #     # 4. Return the transformed movies as JSON.
# #     return jsonify({"recommendedMovies": transformed_movies})

# # if __name__ == "__main__":
# #     app.run(debug=True, port=5001)

# from flask import Flask, jsonify
# import pyreadstat
# import os
# import pandas as pd

# app = Flask(__name__)

# sav_file = os.path.join(os.path.dirname(__file__), "recommender.sav")

# try:
#     df, meta = pyreadstat.read_sav(sav_file)
#     # Group by user_id and rec_type
#     recommendations_lookup = (
#         df.groupby(['user_id', 'rec_type'])['title']
#         .apply(list)
#         .unstack()
#         .to_dict('index')
#     )
#     # Convert to desired format
#     recommendations_lookup = {
#         user_id: {
#             "top_all_recs": recs.get('top_all', []),
#             "top_genre_recs": recs.get('top_genre', []),
#             "second_genre_recs": recs.get('second_genre', [])
#         }
#         for user_id, recs in recommendations_lookup.items()
#     }
#     print("Loaded recommender.sav successfully:")
#     print(recommendations_lookup)
# except Exception as e:
#     recommendations_lookup = {}
#     print("Error loading sav file:", e)

# @app.route('/api/recommendations/<user_id>', methods=['GET'])
# def get_recommendations(user_id):
#     user_id_str = str(user_id)
#     recs = recommendations_lookup.get(user_id_str, {
#         "top_all_recs": [],
#         "top_genre_recs": [],
#         "second_genre_recs": []
#     })
#     return jsonify({
#         "user_id": user_id_str,
#         "recommendations": {
#             "top_all": recs["top_all_recs"],
#             "top_genre": recs["top_genre_recs"],
#             "second_genre": recs["second_genre_recs"]
#         }
#     })

# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0', port=5001)
import os
import sqlite3
from flask import Flask, jsonify
from flask_cors import CORS
import pyreadstat
import pandas as pd

app = Flask(__name__)
CORS(app)

sav_file = os.path.join(os.path.dirname(__file__), "recommender.sav")

try:
    df, meta = pyreadstat.read_sav(sav_file)
    print("Raw DataFrame from recommender.sav:")
    print(df.head())
    
    # Alternative grouping without apply
    recommendations_lookup = {}
    for user_id, user_df in df.groupby('user_id'):
        top_all = user_df[user_df['rec_type'] == 'top_all'][['show_id', 'title', 'match_score']].to_dict('records')
        top_genre = user_df[user_df['rec_type'] == 'top_genre'][['show_id', 'title', 'match_score']].to_dict('records')
        second_genre = user_df[user_df['rec_type'] == 'second_genre'][['show_id', 'title', 'match_score']].to_dict('records')
        
        top_genre_name = user_df[user_df['rec_type'] == 'top_genre']['genre_name'].iloc[0] if not user_df[user_df['rec_type'] == 'top_genre'].empty else 'None'
        second_genre_name = user_df[user_df['rec_type'] == 'second_genre']['genre_name'].iloc[0] if not user_df[user_df['rec_type'] == 'second_genre'].empty else 'None'
        
        recommendations_lookup[user_id] = {
            "top_all_recs": top_all,
            "top_genre_recs": top_genre,
            "second_genre_recs": second_genre,
            "top_genre_name": top_genre_name,
            "second_genre_name": second_genre_name
        }
    print("Loaded recommender.sav successfully")
    print(f"Recommendations lookup: {recommendations_lookup}")
    print(f"Data for user '189': {recommendations_lookup.get('189', 'Not found')}")
except Exception as e:
    recommendations_lookup = {}
    print("Error loading sav file:", e)

def get_movie_details_by_show_ids(show_ids):
    db_path = os.path.join(os.path.dirname(__file__), "..", "movies.db")
    db_path = os.path.abspath(db_path)
    connection = sqlite3.connect(db_path)
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()
    placeholders = ','.join('?' for _ in show_ids)
    query = f"SELECT * FROM movies_titles WHERE show_id IN ({placeholders})"
    cursor.execute(query, show_ids)
    rows = cursor.fetchall()
    movies = [dict(row) for row in rows]
    connection.close()
    return movies

def transform_movie(movie, match_score=0.0):
    return {
        "movieId": movie.get("show_id"),
        "title": movie.get("title"),
        "description": movie.get("description", "No description available"),
        "duration": movie.get("duration", "N/A"),
        "rating": movie.get("rating", "N/A"),
        "year": movie.get("release_year", 0),
        "averageRating": 3.5,
        "matchScore": match_score
    }

@app.route("/api/recommendations/<user_id>", methods=["GET"])
def recommendations(user_id):
    user_id_str = str(user_id)
    recs = recommendations_lookup.get(user_id_str, {
        "top_all_recs": [],
        "top_genre_recs": [],
        "second_genre_recs": [],
        "top_genre_name": "None",
        "second_genre_name": "None"
    })
    print(f"Raw recs for {user_id_str}: {recs}")
    
    all_show_ids = (
        [rec['show_id'] for rec in recs["top_all_recs"]] +
        [rec['show_id'] for rec in recs["top_genre_recs"]] +
        [rec['show_id'] for rec in recs["second_genre_recs"]]
    )
    print(f"Show IDs to query: {all_show_ids}")
    
    if all_show_ids:
        raw_movies = get_movie_details_by_show_ids(all_show_ids)
        movies_dict = {movie['show_id']: movie for movie in raw_movies}
        print(f"Raw movies from DB: {raw_movies}")
    else:
        movies_dict = {}
    
    top_all_movies = [
        transform_movie(movies_dict.get(rec['show_id'], {'show_id': rec['show_id'], 'title': rec['title']}), rec['match_score'])
        for rec in recs["top_all_recs"]
    ]
    top_genre_movies = [
        transform_movie(movies_dict.get(rec['show_id'], {'show_id': rec['show_id'], 'title': rec['title']}))
        for rec in recs["top_genre_recs"]
    ]
    second_genre_movies = [
        transform_movie(movies_dict.get(rec['show_id'], {'show_id': rec['show_id'], 'title': rec['title']}))
        for rec in recs["second_genre_recs"]
    ]
    
    return jsonify({
        "user_id": user_id_str,
        "recommendations": {
            "top_all": top_all_movies,
            "top_genre": top_genre_movies,
            "second_genre": second_genre_movies,
            "top_genre_name": recs["top_genre_name"],
            "second_genre_name": recs["second_genre_name"]
        }
    })

if __name__ == "__main__":
    app.run(debug=True, port=5001)