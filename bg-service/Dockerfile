FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Download the small model while building, so the first request is faster.
ENV MODEL_NAME=u2netp
RUN python -c "from rembg import new_session; new_session('u2netp')"

COPY app.py .

CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT:-10000}"]