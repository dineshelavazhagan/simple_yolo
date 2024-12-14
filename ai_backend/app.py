from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import os
import uuid
import cv2
import json
from ultralytics import YOLO

app = FastAPI()

# Load classes from coco.txt
CLASSES = {}
with open('coco.txt', 'r') as f:
    lines = f.read().strip().split('\n')
    CLASSES = {i: line for i, line in enumerate(lines)}

model = YOLO('yolov8n.pt')  # or yolov3 if you have the weights

RESULTS_DIR = '/results'
if not os.path.exists(RESULTS_DIR):
    os.makedirs(RESULTS_DIR)

@app.post("/detect/")
async def detect(file: UploadFile = File(...)):
    image_id = str(uuid.uuid4())
    input_image_path = os.path.join(RESULTS_DIR, f"{image_id}_{file.filename}")
    with open(input_image_path, "wb") as f:
        f.write(await file.read())

    results = model.predict(input_image_path, conf=0.25)
    result = results[0]

    detections = []
    for box in result.boxes:
        xyxy = box.xyxy[0].cpu().numpy()
        class_id = int(box.cls[0].item())
        confidence = float(box.conf[0].item())
        x1, y1, x2, y2 = xyxy
        detections.append({
            "class_id": class_id,
            "class_name": CLASSES[class_id],
            "confidence": confidence,
            "bbox": [float(x1), float(y1), float(x2), float(y2)]
        })

    response = {
        "objects": detections
    }

    # Optionally save JSON file
    json_path = os.path.join(RESULTS_DIR, f"{image_id}_result.json")
    with open(json_path, 'w') as jf:
        json.dump(response, jf, indent=4)

    return JSONResponse(content=response)
