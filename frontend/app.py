from flask import Flask, request, render_template, jsonify, send_from_directory
import requests
import os

app = Flask(__name__)

AI_BACKEND_URL = os.environ.get('AI_BACKEND_URL', 'http://localhost:8000')

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/detect', methods=['POST'])
def detect():
    if 'file' not in request.files:
        return 'No file part', 400
    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400

    files = {'file': (file.filename, file.read(), file.content_type)}
    try:
        response = requests.post(f"{AI_BACKEND_URL}/detect/", files=files)
        response.raise_for_status()
        detection_result = response.json()
        return jsonify(detection_result)
    except requests.exceptions.RequestException as e:
        return f"Error communicating with AI backend: {e}", 500

@app.route('/results/<path:filename>')
def results_files(filename):
    return send_from_directory(os.path.abspath('../results'), filename)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
