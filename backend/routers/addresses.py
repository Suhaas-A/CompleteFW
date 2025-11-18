# backend/routers/addresses.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from db.database import get_db
from model.tables import Address, Users
from schemas.data import AddressCreate, AddressOut
from routers.utils import get_current_active_user

router = APIRouter(prefix="/addresses", tags=["addresses"])

@router.post("/", response_model=AddressOut)
def add_address(payload: AddressCreate, db: Session = Depends(get_db), current_user: Users = Depends(get_current_active_user)):
    if payload.is_default:
        # unset previous default
        db.query(Address).filter(Address.user_id == current_user.id).update({"is_default": False})
    addr = Address(user_id=current_user.id, **payload.model_dump())
    db.add(addr)
    db.commit()
    db.refresh(addr)
    return addr

@router.get("/", response_model=List[AddressOut])
def list_addresses(db: Session = Depends(get_db), current_user: Users = Depends(get_current_active_user)):
    addresses = db.query(Address).filter(Address.user_id == current_user.id).order_by(Address.is_default.desc(), Address.created_at.desc()).all()
    return addresses

@router.delete("/{address_id}", status_code=200)
def delete_address(address_id: int, db: Session = Depends(get_db), current_user: Users = Depends(get_current_active_user)):
    addr = db.query(Address).filter(Address.id == address_id, Address.user_id == current_user.id).first()
    if not addr:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Address not found")
    db.delete(addr)
    db.commit()
    return {"message": "Address deleted"}

