from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import verify_password, create_access_token
from app.models.models import AdminUser
from app.schemas.schemas import LoginRequest, TokenResponse
from app.api.deps import get_current_admin

router = APIRouter()

@router.post("/login", response_model=TokenResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(AdminUser).filter(AdminUser.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role,
        }
    }

@router.get("/me")
def read_current_user(current_admin: AdminUser = Depends(get_current_admin)):
    return {
        "id": current_admin.id,
        "email": current_admin.email,
        "role": current_admin.role,
        "created_at": current_admin.created_at,
    }
