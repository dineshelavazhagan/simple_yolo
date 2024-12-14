FROM python:3.9-slim-buster

WORKDIR /app

RUN apt update && apt-get install -y libgl1 libglib2.0-0 ffmpeg libsm6 libxext6

COPY req.txt /app/req.txt
RUN pip install --no-cache-dir -r req.txt

COPY . /app

EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
