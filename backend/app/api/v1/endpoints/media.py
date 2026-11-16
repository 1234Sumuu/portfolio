import os
import time
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.models.models import MediaAsset
from app.schemas.schemas import MediaAssetResponse
from app.api.deps import get_current_admin

router = APIRouter()

@router.get("/", response_model=List[MediaAssetResponse])
def get_media_assets(db: Session = Depends(get_db)):
    assets = db.query(MediaAsset).order_by(MediaAsset.created_at.desc()).all()
    return assets

@router.post("/upload", response_model=MediaAssetResponse, status_code=status.HTTP_201_CREATED)
async def upload_media_file(
    file: UploadFile = File(...),
    folder: str = Form("uploads"),
    alt_text: str = Form(""),
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin)
):
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    safe_name = f"{int(time.time())}_{file.filename.replace(' ', '_')}"
    file_path = os.path.join(settings.UPLOAD_DIR, safe_name)

    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    public_url = f"/uploads/{safe_name}"

    asset = MediaAsset(
        filename=safe_name,
        original_name=file.filename,
        url=public_url,
        mime_type=file.content_type or "application/octet-stream",
        size_bytes=len(content),
        folder=folder,
        alt_text=alt_text,
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return asset
