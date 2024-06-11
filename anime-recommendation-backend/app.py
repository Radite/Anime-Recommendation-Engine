from flask import Flask, jsonify, request
from RecommendationFunc import generate_top_recommendations, predict_user_rating, retrain_model
from flask_cors import CORS
from surprise import SVDpp
import pickle

app = Flask(__name__)
CORS(app)

# Variable to store the status of model retraining
model_retraining_status = False

# Load the SVD++ model
def load_svdpp_model():
    with open('svdpp_model.pkl', 'rb') as f:
        return pickle.load(f)

# Route to reload the model
@app.route('/reload-model')
def reload_model():
    try:
        svdpp = load_svdpp_model()
        return 'Model reloaded successfully'
    except Exception as e:
        return f'Error reloading model: {str(e)}'

# Route to get recommendations
@app.route('/recommendations/<int:user_id>')
def get_recommendations(user_id):
    try:
        recommendations = generate_top_recommendations(user_id)
        return jsonify(recommendations)
    except Exception as e:
        return f'Error generating recommendations: {str(e)}'

# Route to predict rating
@app.route('/predict-rating/<int:user_id>/<int:anime_id>')
def predict_rating(user_id, anime_id):
    try:
        svdpp = load_svdpp_model()  # Load the SVD++ model
        rating, anime_display_name = predict_user_rating(user_id, anime_id, svdpp)
        return jsonify({'predicted_rating': rating, 'anime_display_name': anime_display_name})
    except Exception as e:
        return f'Error predicting rating: {str(e)}'

# Route to get the status of model retraining
@app.route('/model/status')
def get_model_retraining_status():
    global model_retraining_status
    return jsonify({'retraining': model_retraining_status})

# Route to initiate model retraining
@app.route('/retrain-model', methods=['POST'])
def retrain_model_endpoint():
    global model_retraining_status
    print("Retraining model endpoint called...")
    try:
        model_retraining_status = True
        retrain_model()
        print("Model retrained successfully")
        model_retraining_status = False
        return 'Model retrained successfully', 200
    except Exception as e:
        model_retraining_status = False
        print(f'Error retraining model: {str(e)}')
        return f'Error retraining model: {str(e)}', 500

if __name__ == '__main__':
    app.run(debug=True)
