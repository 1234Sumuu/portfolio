import os
import shutil
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings

db_url = settings.DATABASE_URL

# Handle read-only serverless environment (e.g. Vercel)
if "sqlite" in db_url:
    raw_path = db_url.replace("sqlite:///", "")
    if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
        tmp_db_path = "/tmp/portfolio.db"
        orig_db_path = os.path.abspath(raw_path)
        if os.path.exists(orig_db_path) and not os.path.exists(tmp_db_path):
            try:
                shutil.copy2(orig_db_path, tmp_db_path)
            except Exception as e:
                print(f"Warning: could not copy sqlite db to /tmp: {e}")
        db_url = f"sqlite:///{tmp_db_path}"
    else:
        try:
            db_dir = os.path.dirname(os.path.abspath(raw_path))
            if db_dir:
                os.makedirs(db_dir, exist_ok=True)
        except Exception as e:
            print(f"Warning: could not create db dir: {e}")

connect_args = {"check_same_thread": False} if "sqlite" in db_url else {}

engine = create_engine(
    db_url,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
