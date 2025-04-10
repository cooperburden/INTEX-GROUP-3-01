# # import pandas as pd
# # import pyreadstat

# # # Load the data
# # titles_df = pd.read_csv('movies_titles.csv')
# # ratings_df = pd.read_csv('movies_ratings.csv')

# # # Merge ratings with titles to get genre info
# # user_ratings = ratings_df.merge(titles_df, on='show_id')

# # # Define non-genre columns
# # non_genre_cols = [
# #     'show_id', 'type', 'title', 'director', 'cast', 'country',
# #     'release_year', 'rating', 'duration', 'description',
# #     'user_id', 'rating_x', 'rating_y'
# # ]

# # # Detect genre columns (binary 0/1 flags)
# # genre_columns = [
# #     col for col in user_ratings.columns
# #     if col not in non_genre_cols and user_ratings[col].dropna().isin([0, 1]).all()
# # ]

# # # Get all unique user IDs
# # all_user_ids = ratings_df['user_id'].unique()

# # # Dictionary to store recommendations for each user
# # all_user_recommendations = {}

# # # Loop through each user
# # for user_id in all_user_ids:
# #     # Filter ratings for this user
# #     user_ratings_subset = user_ratings[user_ratings['user_id'] == user_id]
    
# #     # Calculate genre preferences (sum of genres for rated movies)
# #     user_genre_counts = user_ratings_subset[genre_columns].sum().sort_values(ascending=False)
# #     top_genres = user_genre_counts[user_genre_counts > 0].index.tolist()
    
# #     # Get show_ids the user has already rated
# #     rated_show_ids = user_ratings_subset['show_id'].unique()
    
# #     # Filter unseen movies
# #     unseen_movies = titles_df[~titles_df['show_id'].isin(rated_show_ids)]
    
# #     # Filter unseen movies matching user's top genres
# #     recommended_by_genre = unseen_movies[unseen_movies[top_genres].sum(axis=1) > 0].copy()
    
# #     # Calculate match score and sort
# #     recommended_by_genre.loc[:, 'match_score'] = recommended_by_genre[top_genres].sum(axis=1)
# #     recommended_by_genre = recommended_by_genre.sort_values(by='match_score', ascending=False)
    
# #     # Get top 10 recommendations (titles only)
# #     top_recommendations = recommended_by_genre['title'].head(10).tolist()
    
# #     # Store in dictionary with user_id as string
# #     all_user_recommendations[str(user_id)] = top_recommendations

# # # Convert to DataFrame for saving as SPSS .sav
# # # We need a flat structure, so we'll explode the recommendations
# # records = []
# # for user_id, recs in all_user_recommendations.items():
# #     for rec in recs:
# #         records.append({'user_id': user_id, 'title': rec})

# # recommendations_df = pd.DataFrame(records)

# # # Save to SPSS .sav file
# # pyreadstat.write_sav(recommendations_df, "recommender.sav")

# # print("Generated recommendations for all users and saved to recommender.sav")
# # print(f"Sample for user '2': {all_user_recommendations.get('2', 'Not found')}")

# import pandas as pd
# import pyreadstat

# # Load the data
# titles_df = pd.read_csv('movies_titles.csv')
# ratings_df = pd.read_csv('movies_ratings.csv')

# # Merge ratings with titles to get genre info
# user_ratings = ratings_df.merge(titles_df, on='show_id')

# # Define non-genre columns
# non_genre_cols = [
#     'show_id', 'type', 'title', 'director', 'cast', 'country',
#     'release_year', 'rating', 'duration', 'description',
#     'user_id', 'rating_x', 'rating_y'
# ]

# # Detect genre columns (binary 0/1 flags)
# genre_columns = [
#     col for col in user_ratings.columns
#     if col not in non_genre_cols and user_ratings[col].dropna().isin([0, 1]).all()
# ]

# # Get all unique user IDs
# all_user_ids = ratings_df['user_id'].unique()

# # Dictionary to store recommendations for each user
# all_user_recommendations = {}

# # Loop through each user
# for user_id in all_user_ids:
#     # Filter ratings for this user
#     user_ratings_subset = user_ratings[user_ratings['user_id'] == user_id]
    
#     # Calculate genre preferences
#     user_genre_counts = user_ratings_subset[genre_columns].sum().sort_values(ascending=False)
#     top_genres = user_genre_counts[user_genre_counts > 0].index.tolist()
    
#     # Get show_ids the user has already rated
#     rated_show_ids = user_ratings_subset['show_id'].unique()
    
#     # Filter unseen movies
#     unseen_movies = titles_df[~titles_df['show_id'].isin(rated_show_ids)].copy()
    
#     # 1. Top All Recommendations (based on all top genres)
#     recommended_by_genre = unseen_movies[unseen_movies[top_genres].sum(axis=1) > 0].copy()
#     recommended_by_genre.loc[:, 'match_score'] = recommended_by_genre[top_genres].sum(axis=1)
#     recommended_by_genre = recommended_by_genre.sort_values(by='match_score', ascending=False)
#     top_all_recs = recommended_by_genre['title'].head(5).tolist()
    
#     # Get top 2 genres (if available)
#     top_genre = top_genres[0] if len(top_genres) >= 1 else None
#     second_genre = top_genres[1] if len(top_genres) >= 2 else None
    
#     # 2. Top Genre Recommendations (only #1 genre)
#     top_genre_recs = []
#     if top_genre:
#         top_genre_movies = unseen_movies[unseen_movies[top_genre] == 1]
#         top_genre_recs = top_genre_movies['title'].head(5).tolist()
    
#     # 3. Second Genre Recommendations (only #2 genre)
#     second_genre_recs = []
#     if second_genre:
#         second_genre_movies = unseen_movies[unseen_movies[second_genre] == 1]
#         second_genre_recs = second_genre_movies['title'].head(5).tolist()
    
#     # Store all three lists in a nested structure
#     all_user_recommendations[str(user_id)] = {
#         "top_all_recs": top_all_recs,
#         "top_genre_recs": top_genre_recs,
#         "second_genre_recs": second_genre_recs
#     }

# # Convert to DataFrame for SPSS .sav
# records = []
# for user_id, recs in all_user_recommendations.items():
#     # Top all recs
#     for rec in recs["top_all_recs"]:
#         records.append({'user_id': user_id, 'title': rec, 'rec_type': 'top_all'})
#     # Top genre recs
#     for rec in recs["top_genre_recs"]:
#         records.append({'user_id': user_id, 'title': rec, 'rec_type': 'top_genre'})
#     # Second genre recs
#     for rec in recs["second_genre_recs"]:
#         records.append({'user_id': user_id, 'title': rec, 'rec_type': 'second_genre'})

# recommendations_df = pd.DataFrame(records)

# # Save to SPSS .sav file
# pyreadstat.write_sav(recommendations_df, "recommender.sav")

# print("Generated recommendations for all users and saved to recommender.sav")
# print(f"Sample for user '2': {all_user_recommendations.get('2', 'Not found')}")

import pandas as pd
import pyreadstat

# Load the data
titles_df = pd.read_csv('movies_titles.csv')
ratings_df = pd.read_csv('movies_ratings.csv')

# Merge ratings with titles to get genre info
user_ratings = ratings_df.merge(titles_df, on='show_id')

# Define non-genre columns
non_genre_cols = [
    'show_id', 'type', 'title', 'director', 'cast', 'country',
    'release_year', 'rating', 'duration', 'description',
    'user_id', 'rating_x', 'rating_y'
]

# Detect genre columns (binary 0/1 flags)
genre_columns = [
    col for col in user_ratings.columns
    if col not in non_genre_cols and user_ratings[col].dropna().isin([0, 1]).all()
]

# Get all unique user IDs
all_user_ids = ratings_df['user_id'].unique()

# Dictionary to store recommendations for each user
all_user_recommendations = {}

# Loop through each user
for user_id in all_user_ids:
    # Filter ratings for this user
    user_ratings_subset = user_ratings[user_ratings['user_id'] == user_id]
    
    # Calculate genre preferences
    user_genre_counts = user_ratings_subset[genre_columns].sum().sort_values(ascending=False)
    top_genres = user_genre_counts[user_genre_counts > 0].index.tolist()
    
    # Get show_ids the user has already rated
    rated_show_ids = user_ratings_subset['show_id'].unique()
    
    # Filter unseen movies
    unseen_movies = titles_df[~titles_df['show_id'].isin(rated_show_ids)].copy()
    
    # 1. Top All Recommendations (based on all top genres)
    recommended_by_genre = unseen_movies[unseen_movies[top_genres].sum(axis=1) > 0].copy()
    recommended_by_genre.loc[:, 'match_score'] = recommended_by_genre[top_genres].sum(axis=1)
    recommended_by_genre = recommended_by_genre.sort_values(by='match_score', ascending=False)
    top_all_recs = recommended_by_genre[['show_id', 'title', 'match_score']].head(5).to_dict('records')
    
    # Get top 2 genres (if available)
    top_genre = top_genres[0] if len(top_genres) >= 1 else None
    second_genre = top_genres[1] if len(top_genres) >= 2 else None
    
    # 2. Top Genre Recommendations (only #1 genre)
    top_genre_recs = []
    if top_genre:
        top_genre_movies = unseen_movies[unseen_movies[top_genre] == 1]
        top_genre_recs = top_genre_movies[['show_id', 'title']].head(5).to_dict('records')
    
    # 3. Second Genre Recommendations (only #2 genre)
    second_genre_recs = []
    if second_genre:
        second_genre_movies = unseen_movies[unseen_movies[second_genre] == 1]
        second_genre_recs = second_genre_movies[['show_id', 'title']].head(5).to_dict('records')
    
    # Store all three lists with genre names
    all_user_recommendations[str(user_id)] = {
        "top_all_recs": top_all_recs,
        "top_genre_recs": top_genre_recs,
        "second_genre_recs": second_genre_recs,
        "top_genre_name": top_genre or "None",
        "second_genre_name": second_genre or "None"
    }

# Convert to DataFrame for SPSS .sav
records = []
for user_id, recs in all_user_recommendations.items():
    # Top all recs
    for rec in recs["top_all_recs"]:
        records.append({
            'user_id': user_id,
            'show_id': rec['show_id'],
            'title': rec['title'],
            'match_score': rec['match_score'],
            'rec_type': 'top_all',
            'genre_name': ''  # Not applicable for top_all
        })
    # Top genre recs
    for rec in recs["top_genre_recs"]:
        records.append({
            'user_id': user_id,
            'show_id': rec['show_id'],
            'title': rec['title'],
            'match_score': 0.0,  # Not used for genre-specific
            'rec_type': 'top_genre',
            'genre_name': recs["top_genre_name"]
        })
    # Second genre recs
    for rec in recs["second_genre_recs"]:
        records.append({
            'user_id': user_id,
            'show_id': rec['show_id'],
            'title': rec['title'],
            'match_score': 0.0,
            'rec_type': 'second_genre',
            'genre_name': recs["second_genre_name"]
        })

recommendations_df = pd.DataFrame(records)

# Save to SPSS .sav file
pyreadstat.write_sav(recommendations_df, "recommender.sav")

print("Generated recommendations for all users and saved to recommender.sav")
print(f"Sample for user '2': {all_user_recommendations.get('2', 'Not found')}")