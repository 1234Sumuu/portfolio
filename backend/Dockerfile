FROM python:3.11-slim

WORKDIR /app

# Install system dependencies if needed (e.g. build-essential, curl)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY app/ ./app/
COPY scripts/ ./scripts/

# Create data and uploads directories
RUN mkdir -p data uploads

EXPOSE 8063

ENV PORT=8063 \
    HOST=0.0.0.0 \
    DATABASE_URL="sqlite:///./data/portfolio.db"

# Seed if DB does not exist, then start uvicorn
CMD ["sh", "-c", "python scripts/seed.py && uvicorn app.main:app --host 0.0.0.0 --port 8063"]
