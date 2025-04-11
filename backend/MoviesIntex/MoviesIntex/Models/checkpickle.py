import os
import sqlite3
import sys
import json
import pyreadstat
import pandas as pd

sav_file = os.path.join(os.path.dirname(__file__), "recommender.sav")

# Load recommender.sav (unchanged)
try:
    df, meta = pyreadstat.read_sav(sav_file)
    recommendations_lookup = {}
    for user_id, user_df in df.groupby('user_id'):
        top_all = user_df[user_df['rec_type'] == 'top_all'][['show_id', 'title', 'match_score']].to_dict('records')
        top_genre = user_df[user_df['rec_type'] == 'top_genre'][['show_id', 'title', 'match_score']].to_dict('records')
        second_genre = user_df[user_df['rec_type'] == 'second_genre'][['show_id', 'title', 'match_score']].to_dict('records')

        top_genre_name = user_df[user_df['rec_type'] == 'top_genre']['genre_name'].iloc[0] if not user_df[user_df['rec_type'] == 'top_genre'].empty else 'None'
        second_genre_name = user_df[user_df['rec_type'] == 'second_genre']['genre_name'].iloc[0] if not user_df[user_df['rec_type'] == 'second_genre'].empty else 'None'

        recommendations_lookup[str(user_id)] = {
            "top_all_recs": top_all,
            "top_genre_recs": top_genre,
            "second_genre_recs": second_genre,
            "top_genre_name": top_genre_name,
            "second_genre_name": second_genre_name
        }
except Exception as e:
    recommendations_lookup = {}

content_sav_file = os.path.join(os.path.dirname(__file__), "content_recommendations.sav")
try:
    content_df, content_meta = pyreadstat.read_sav(content_sav_file)
    content_recommendations_lookup = {}
    for show_id, show_df in content_df.groupby('show_id'):
        content_recommendations_lookup[show_id] = show_df[['recommended_show_id', 'recommended_title']].to_dict('records')
except Exception as e:
    content_recommendations_lookup = {}

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

def get_average_rating(show_id):
    db_path = os.path.join(os.path.dirname(__file__), "..", "movies.db")
    db_path = os.path.abspath(db_path)
    connection = sqlite3.connect(db_path)
    cursor = connection.cursor()
    query = "SELECT AVG(rating) as avg_rating FROM movies_ratings WHERE show_id = ?"
    cursor.execute(query, (show_id,))
    result = cursor.fetchone()
    connection.close()
    return result[0] if result[0] is not None else 3.5

def transform_movie(movie, match_score=0.0):
    show_id = movie.get("show_id")
    average_rating = get_average_rating(show_id)
    return {
        "movieId": show_id,
        "title": movie.get("title"),
        "description": movie.get("description", "No description available"),
        "duration": movie.get("duration", "N/A"),
        "rating": movie.get("rating", "N/A"),
        "year": movie.get("release_year", 0),
        "averageRating": round(average_rating, 1),
        "matchScore": match_score
    }

def get_recommendations_for_user(user_id):
    user_id_str = str(user_id)
    recs = recommendations_lookup.get(user_id_str, {
        "top_all_recs": [],
        "top_genre_recs": [],
        "second_genre_recs": [],
        "top_genre_name": "None",
        "second_genre_name": "None"
    })

    all_show_ids = (
        [rec['show_id'] for rec in recs["top_all_recs"]] +
        [rec['show_id'] for rec in recs["top_genre_recs"]] +
        [rec['show_id'] for rec in recs["second_genre_recs"]]
    )

    if all_show_ids:
        raw_movies = get_movie_details_by_show_ids(all_show_ids)
        movies_dict = {movie['show_id']: movie for movie in raw_movies}
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

    return {
        "user_id": user_id_str,
        "recommendations": {
            "top_all": top_all_movies,
            "top_genre": top_genre_movies,
            "second_genre": second_genre_movies,
            "top_genre_name": recs["top_genre_name"],
            "second_genre_name": recs["second_genre_name"]
        }
    }

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Missing user_id"}))
        sys.exit(1)

    try:
        user_id = int(sys.argv[1])
        result = get_recommendations_for_user(user_id)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
