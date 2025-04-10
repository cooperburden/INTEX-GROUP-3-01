# from flask import Flask, jsonify
# import pickle
# import os

# app = Flask(__name__)

# # Load your pickle file when the module is imported
# pickle_file = os.path.join(os.path.dirname(__file__), "recommendations.pkl")

# try:
#     with open(pickle_file, "rb") as f:
#         recommendations_lookup = pickle.load(f)
# except Exception as e:
#     recommendations_lookup = {}
#     print("Error loading pickle file:", e)

# # API endpoint to get recommendations for a user
# @app.route('/api/recommendations/<user_id>', methods=['GET'])
# def get_recommendations(user_id):
#     """
#     Returns movie recommendations for a given user.
#     """
#     user_id_str = str(user_id)
#     recommendations = recommendations_lookup.get(user_id_str, [])
#     return jsonify({"user_id": user_id_str, "recommendations": recommendations})

# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0', port=5000)

from flask import Flask, request, jsonify
from flask_cors import CORS  # Import the extension

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes (by default, allows all origins)

def get_recommended_movie_ids(user_id):
    # Your recommendation logic goes here; for now, return dummy values.
    return ["s1", "s2", "s3"]

@app.route("/recommend", methods=["GET"])
def recommend():
    user_id = request.args.get("userId")
    if not user_id:
        return jsonify({"error": "Missing userId parameter"}), 400
    recommended_ids = get_recommended_movie_ids(user_id)
    return jsonify({"recommendedIds": recommended_ids})

if __name__ == "__main__":
    app.run(debug=True, port=5001)
