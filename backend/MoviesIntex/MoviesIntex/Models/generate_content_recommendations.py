import pandas as pd
import pyreadstat
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

# Load datasets
titles_df = pd.read_csv("movies_titles.csv")

# Fill missing values in relevant text fields
titles_df['description'] = titles_df['description'].fillna('')
titles_df['director'] = titles_df['director'].fillna('')

# Dynamically detect genre columns (assume binary flags with 0 or 1)
non_genre_cols = ['show_id', 'type', 'title', 'director', 'cast', 'country',
                  'release_year', 'rating', 'duration', 'description']
genre_columns = [
    col for col in titles_df.columns
    if col not in non_genre_cols and titles_df[col].dropna().isin([0, 1]).all()
]

# Combine genre names into a single string for each show
titles_df['genres'] = titles_df[genre_columns].apply(
    lambda row: ' '.join([col for col in genre_columns if row[col] == 1]), axis=1
)

# Create a combined text field for TF-IDF vectorization
titles_df['combined'] = (
    titles_df['description'] + " " +
    titles_df['director'] + " " +
    titles_df['genres']
)

# Vectorize the combined text using TF-IDF
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(titles_df['combined'])

# Compute cosine similarity matrix
cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

# Build a reverse mapping of show_id to DataFrame index
indices = pd.Series(titles_df.index, index=titles_df['show_id'])

# CONTENT Recommendation function
def get_recommendations(show_id, cosine_sim=cosine_sim, top_n=10):
    if show_id not in indices:
        return []

    idx = indices[show_id]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:top_n + 1]  # Top N recommendations excluding itself
    show_indices = [i[0] for i in sim_scores]
    recommended_movies = titles_df.iloc[show_indices][['show_id', 'title']].to_dict('records')
    return recommended_movies

# Generate recommendations for all show_ids
all_show_ids = titles_df['show_id'].unique()
content_recommendations = []

for show_id in all_show_ids:
    recommendations = get_recommendations(show_id, top_n=10)
    for rec in recommendations:
        content_recommendations.append({
            'show_id': show_id,
            'recommended_show_id': rec['show_id'],
            'recommended_title': rec['title']
        })

# Convert to DataFrame
content_recs_df = pd.DataFrame(content_recommendations)

# Save to .sav file
pyreadstat.write_sav(content_recs_df, "content_recommendations.sav")

print("Content-based recommendations saved to content_recommendations.sav")
print(content_recs_df.head())