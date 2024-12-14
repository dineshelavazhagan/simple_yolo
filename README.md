# Object Detection Microservice

This project is a demonstration of a microservice architecture for object detection. It consists of two main components:

## AI Backend (FastAPI)

*   Processes images using a YOLO-based object detection model (YOLOv8 by default, but can be adapted to YOLOv3 or others).
*   Returns detected objects as JSON, including bounding boxes, class labels, and confidence scores.

## Frontend (Flask)

*   Provides a user interface to upload images and then displays the detected objects visually.
*   Users can:
    *   Show or hide bounding boxes.
    *   Show or hide labels.
    *   Adjust a confidence threshold slider.
    *   Filter detections by specific classes.
    *   Optionally display the JSON output of the detection results.
*   The controls are displayed in a sidebar next to the uploaded image.
*   The components run in separate Docker containers and communicate seamlessly via HTTP requests using `docker-compose`.

## Features

*   **Upload an Image:** Users can upload an image from their local machine.
*   **Object Detection:** The AI backend performs object detection and returns a JSON response containing bounding boxes, classes, and confidence values.
*   **Dynamic Controls:** After detection:
    *   **Show Bounding Boxes:** Check/Uncheck to toggle visualization of bounding boxes on the uploaded image.
    *   **Show Labels:** When bounding boxes are visible, toggle class labels and confidence scores.
    *   **Confidence Slider:** Adjust the minimum confidence threshold to filter out low-confidence detections.
    *   **Class Filters:** Enable or disable specific classes to be displayed.
    *   **Show JSON:** View or hide the raw JSON response for debugging or verification.
*   **Single Displayed Image:** Only one image (the original uploaded one) is displayed. Bounding boxes and labels are drawn dynamically on a `<canvas>` overlay. No separate annotated image file is shown to the user.

## Prerequisites

*   Docker and `docker-compose` installed on the host machine.
*   A `results` directory in the project root to store intermediate files and JSON results.
*   Optional: GPU access if desired, but the setup works on CPU.

## Installation and Running

1.  **Clone or Extract the Project:**

    ```bash
    git clone https://github.com/dineshelavazhagan/simple_yolo.git
    cd object-detection-project
    ```

    Or, if you received a zipped folder, unzip it and `cd` into the directory.
2.  **Prepare the Environment:** Ensure the `results` directory exists:

    ```bash
    mkdir -p results
    ```
3.  **Build and Run with Docker Compose:**

    ```bash
    docker-compose up --build
    ```
4.  **Access the Frontend:** Open your browser at:

    ```
    http://localhost:5000
    ```
5.  **Use the Application:**
    *   Click "Choose an image" and select an image with objects (e.g., people, cars).
    *   Click "Upload & Detect".
    *   Once detection finishes, the control panel and JSON output option will appear.
    *   Toggle checkboxes, adjust the slider, and select classes to filter the displayed bounding boxes and labels.

## Directory Structure
```
project/
├── docker-compose.yml
├── results/ # Stores annotated images (if needed) and JSON results
├── frontend/
│ ├── app.py
│ ├── req.txt
│ ├── Dockerfile
│ ├── templates/
│ │ └── index.html
│ └── static/
│ ├── style.css
│ └── script.js
└── ai_backend/
├── app.py
├── req.txt
├── Dockerfile
└── coco.txt # Class names (one per line)
```



## Model and Classes

*   The code uses ultralytics YOLO (e.g., `yolov8n.pt`) by default.
*   `coco.txt` contains class names for the COCO dataset.
*   Adjust the classes and filters in `script.js` and `index.html` as needed.

## References

*   [Flask Documentation](https://flask.palletsprojects.com/en/2.3.x/)
*   [FastAPI Documentation](https://fastapi.tiangolo.com/)
*   [Ultralytics YOLO](https://github.com/ultralytics/ultralytics)
*   [Docker Documentation](https://docs.docker.com/)

## Notes on Development Process

### Initial Work:

*   Implemented the backend detection logic using YOLO.
*   Set up the Docker environment and the initial Flask frontend with an upload button
*   These are completed by leveraging prior project experience

### Subsequent Enhancements with LLMs:

*   **After completing the core functionality (running detection, returning JSON, and a basic frontend to upload images)**, a Large Language Model (LLM) was used as an assistant to refine the user interface and code structure.
*   The LLM helped in:
    *   Improving the frontend layout and controls.
    *   Adding dynamic toggling of bounding boxes, labels, confidence slider, and class filters.
    *   Providing a cleaner, more extensible codebase and a better user experience.
*   The LLM was used after the initial solution was working, as a means to perfect and polish the final deliverable.

## Conclusion

This project demonstrates a simple but complete microservice-based object detection solution using Docker, Flask, FastAPI, and YOLO. It can serve as a template or starting point for more complex object detection systems.
