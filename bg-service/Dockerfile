FROM python:3.11-slim
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"
WORKDIR /home/user/app
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN python -c "from rembg import new_session; new_session('isnet-general-use')"
COPY --chown=user app.py .
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
