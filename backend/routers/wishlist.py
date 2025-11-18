# backend/routers/wishlist.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from db.database import get_db
from model.tables import Wishlist, Products, Users
from routers.routes import get_current_active_user

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])


# ✅ Add product to wishlist
@router.post("/add")
def add_to_wishlist(product_id: int, db: Session = Depends(get_db), current_user: Users = Depends(get_current_active_user)):
    """Add a product to the user's wishlist."""
    product = db.query(Products).filter(Products.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    # Prevent duplicate wishlist entries
    existing = db.query(Wishlist).filter(
        Wishlist.user_id == current_user.id, Wishlist.product_id == product_id
    ).first()
    if existing:
        return {"message": "Already in wishlist"}

    entry = Wishlist(user_id=current_user.id, product_id=product_id)
    db.add(entry)
    db.commit()
    return {"message": "Added to wishlist"}


# ✅ Get wishlist with full product details
@router.get("/")
def get_wishlist(db: Session = Depends(get_db), current_user: Users = Depends(get_current_active_user)):
    """Return all wishlist items with complete product details."""
    wishlist_items = (
        db.query(Wishlist)
        .filter(Wishlist.user_id == current_user.id)
        .all()
    )

    products = []
    for item in wishlist_items:
        product = db.query(Products).filter(Products.id == item.product_id).first()
        if product:
            products.append({
                "id": product.id,
                "name": product.name,
                "price": product.price,
                "description": product.description,
                "photo_link": product.photo_link,
            })

    return products


# ✅ Remove product from wishlist
@router.delete("/remove/{product_id}")
def remove_from_wishlist(product_id: int, db: Session = Depends(get_db), current_user: Users = Depends(get_current_active_user)):
    """Remove a product from the user's wishlist."""
    entry = (
        db.query(Wishlist)
        .filter(Wishlist.user_id == current_user.id, Wishlist.product_id == product_id)
        .first()
    )

    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")

    db.delete(entry)
    db.commit()
    return {"message": "Removed from wishlist"}

