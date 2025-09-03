from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os
from PIL import Image
import traceback
import certifi

# ========== Load environment variables ==========
load_dotenv()

# ========== Initialize Flask app ==========
app = Flask(__name__)
CORS(app)

# ========== MongoDB Setup ==========
MONGO_URI = os.getenv("MONGO_URI")
print("MONGO_URI:", MONGO_URI)

try:
    client = MongoClient(
        MONGO_URI,
        tls=True,
        tlsCAFile=certifi.where(),
        tlsAllowInvalidCertificates=False,
        tlsAllowInvalidHostnames=False
    )
    db = client["brain_tumor_db"]
    users_collection = db["users"]
    client.admin.command('ping')
    print("✅ MongoDB connection successful!")
except Exception as e:
    print("❌ MongoDB connection failed:", e)

# ========== Load Brain Tumor Classifier Model ==========
try:
    MODEL_PATH = os.path.join("model", "brain_tumor_classifier.h5")
    print(f"Loading model from: {MODEL_PATH}")
    model = load_model(MODEL_PATH)
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

# Class labels
class_labels = ['Glioma', 'Meningioma', 'No Tumor', 'Pituitary']

# ========== Utilities ==========
def preprocess_image(img):
    try:
        img = img.resize((150, 150))
        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        return img_array
    except Exception as e:
        print(f"Error preprocessing image: {e}")
        raise e

# ========== API Endpoints ==========

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'Brain Tumor Classifier API is running',
        'model_loaded': model is not None
    })

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        hospital_id = data.get("hospital_id")
        password = data.get("password")

        if not hospital_id or not password:
            return jsonify({"error": "Missing Hospital ID or Password"}), 400

        user = users_collection.find_one({"hospital_id": hospital_id})
        if user and user["password"] == password:
            return jsonify({"message": "Login successful"}), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        print(f"Login Error: {e}")
        return jsonify({"error": "Server error"}), 500

@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        hospital_id = data.get("hospital_id")
        password = data.get("password")
        hospital_name = data.get("hospital_name")
        phone_number = data.get("phone_number")

        if not all([hospital_id, password, hospital_name, phone_number]):
            return jsonify({"error": "All fields are required"}), 400

        existing_user = users_collection.find_one({"hospital_id": hospital_id})
        if existing_user:
            return jsonify({"error": "Hospital ID already registered"}), 409

        users_collection.insert_one({
            "hospital_id": hospital_id,
            "password": password,
            "hospital_name": hospital_name,
            "phone_number": phone_number
        })

        return jsonify({"message": "Signup successful"}), 200
    except Exception as e:
        print(f"Signup Error: {e}")
        return jsonify({"error": "Server error"}), 500

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            return jsonify({'error': 'Only .png, .jpg, and .jpeg files are allowed'}), 400

        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500

        img = Image.open(file.stream).convert("RGB")
        img_array = preprocess_image(img)

        prediction = model.predict(img_array, verbose=0)
        class_index = np.argmax(prediction)
        confidence = float(np.max(prediction))

        return jsonify({
            'result': f"{class_labels[class_index]} ({round(confidence * 100, 2)}% confidence)",
            'class': class_labels[class_index],
            'confidence': round(confidence * 100, 2)
        })

    except Exception as e:
        print(f"Error in prediction: {e}")
        print(f"Traceback: {traceback.format_exc()}")
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

@app.before_request
def log_request():
    print(f"[{request.method}] {request.path} from {request.remote_addr}")

# ========== Run Flask App ==========
if __name__ == '__main__':
    print("🚀 Starting Brain Tumor Classifier API...")
    print(f"Model path: {MODEL_PATH}")
    print(f"Model file exists: {os.path.exists(MODEL_PATH)}")
    app.run(debug=True, host='0.0.0.0', port=5000)
