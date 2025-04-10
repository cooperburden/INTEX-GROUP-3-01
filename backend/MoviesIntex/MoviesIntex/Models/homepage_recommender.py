from flask import Flask, jsonify
import pickle
import os

app = Flask(__name__)

# Load your pickle file when the module is imported
pickle_file = os.path.join(os.path.dirname(__file__), "recommendations.pkl")

try:
    with open(pickle_file, "rb") as f:
        recommendations_lookup = pickle.load(f)
except Exception as e:
    recommendations_lookup = {}
    print("Error loading pickle file:", e)

# API endpoint to get recommendations for a user
@app.route('/api/recommendations/<user_id>', methods=['GET'])
def get_recommendations(user_id):
    """
    Returns movie recommendations for a given user.
    """
    user_id_str = str(user_id)
    recommendations = recommendations_lookup.get(user_id_str, [])
    return jsonify({"user_id": user_id_str, "recommendations": recommendations})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)


