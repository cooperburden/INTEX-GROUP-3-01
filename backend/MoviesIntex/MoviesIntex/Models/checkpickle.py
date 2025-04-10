
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


# Load content-based recommendations (new)
content_sav_file = os.path.join(os.path.dirname(__file__), "content_recommendations.sav")
try:
    content_df, content_meta = pyreadstat.read_sav(content_sav_file)
    print("Raw DataFrame from content_recommendations.sav:")
    print(content_df.head())
    
    content_recommendations_lookup = {}
    for show_id, show_df in content_df.groupby('show_id'):
        content_recommendations_lookup[show_id] = show_df[['recommended_show_id', 'recommended_title']].to_dict('records')
    print("Loaded content_recommendations.sav successfully")
    print(f"Content recommendations lookup: {content_recommendations_lookup}")
    print(f"Content recommendations for show 's1': {content_recommendations_lookup.get('s1', 'Not found')}")
except Exception as e:
    content_recommendations_lookup = {}
    print("Error loading content sav file:", e)


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

# New endpoint for content-based recommendations
@app.route("/api/recommendations/content/<show_id>", methods=["GET"])
def content_recommendations(show_id):
    show_id_str = str(show_id)
    recs = content_recommendations_lookup.get(show_id_str, [])
    print(f"Content recommendations for show {show_id_str}: {recs}")
    
    if not recs:
        return jsonify({
            "show_id": show_id_str,
            "recommendations": []
        })
    
    # Get show_ids for the recommended movies
    recommended_show_ids = [rec['recommended_show_id'] for rec in recs]
    print(f"Recommended show IDs to query: {recommended_show_ids}")
    
    if recommended_show_ids:
        raw_movies = get_movie_details_by_show_ids(recommended_show_ids)
        movies_dict = {movie['show_id']: movie for movie in raw_movies}
        print(f"Raw movies from DB: {raw_movies}")
    else:
        movies_dict = {}
    
    # Transform recommended movies
    recommended_movies = [
        transform_movie(movies_dict.get(rec['recommended_show_id'], {
            'show_id': rec['recommended_show_id'],
            'title': rec['recommended_title']
        }))
        for rec in recs
    ]
    
    return jsonify({
        "show_id": show_id_str,
        "recommendations": recommended_movies
    })

if __name__ == "__main__":
    app.run(debug=True, port=5001)