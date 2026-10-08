#!/bin/bash
set -e

# 1. Start Redis if not running
if ! redis-cli ping >/dev/null 2>&1; then
    echo "Starting Redis server daemon..."
    redis-server --daemonize yes
fi

# Ensure storage directories
mkdir -p uploads results backend/samples /tmp/parseanything/logs

# Ensure sample files exist
python3 backend/samples/generate_samples.py backend/samples >/dev/null 2>&1 || true

# 2. Start Celery worker if not running
if ! pgrep -f "celery -A backend.celery_app worker" >/dev/null 2>&1; then
    echo "Starting Celery worker in background..."
    nohup celery -A backend.celery_app worker --loglevel=info --concurrency=2 > /tmp/parseanything/logs/celery.log 2>&1 &
fi

# 3. Start FastAPI server on port 8001 if not running
if ! pgrep -f "uvicorn backend.main:app" >/dev/null 2>&1; then
    echo "Starting FastAPI server on port 8001..."
    nohup uvicorn backend.main:app --host 0.0.0.0 --port 8001 > /tmp/parseanything/logs/fastapi.log 2>&1 &
fi

# Wait briefly for FastAPI and Celery to be available
for i in {1..10}; do
    if curl -s http://127.0.0.1:8001/api/health >/dev/null 2>&1; then
        echo "FastAPI backend is ready on port 8001."
        break
    fi
    sleep 0.5
done

# 4. Start Vite dev server in foreground
exec vite "$@"
