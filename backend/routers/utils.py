# backend/routers/utils.py
from fastapi import Depends, HTTPException, status
from db.database import get_db
from model.tables import Users
from typing import Any
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

def get_current_user(token: str = Depends(oauth2_scheme), db=Depends(get_db)) -> Users:
    from jose import JWTError
    from schemas.data import TokenData
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    user = db.query(Users).filter(Users.username == username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

def get_current_active_user(current_user: Users = Depends(get_current_user)) -> Users:
    return current_user

def admin_required(current_user: Users = Depends(get_current_active_user)) -> Users:
    if not getattr(current_user, "admin", False):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    return current_user

