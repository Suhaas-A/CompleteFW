# backend/routers/reviews.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend.db.database import get_db
from backend.model.tables import Review, Products, Users
from backend.schemas.data import ReviewCreate, ReviewOut
from backend.routers.utils import get_current_active_user

router = APIRouter(prefix="/reviews", tags=["reviews"])

@router.post("/", response_model=ReviewOut)
def post_review(payload: ReviewCreate, db: Session = Depends(get_db), current_user: Users = Depends(get_current_active_user)):
    product = db.query(Products).filter(Products.id == payload.product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    # Optional: prevent duplicate reviews per user per product (or allow multiple)
    existing = db.query(Review).filter(Review.user_id == current_user.id, Review.product_id == payload.product_id).first()
    if existing:
        # update existing
        existing.rating = payload.rating
        existing.comment = payload.comment
        db.commit()
        db.refresh(existing)
        return existing

    r = Review(user_id=current_user.id, product_id=payload.product_id, rating=payload.rating, comment=payload.comment)
    db.add(r)
    db.commit()
    db.refresh(r)
    return r

@router.get("/product/{product_id}", response_model=List[ReviewOut])
def get_product_reviews(product_id: int, db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.product_id == product_id).order_by(Review.created_at.desc()).all()
    return reviews

@router.get("/product/{product_id}/summary")
def product_review_summary(product_id: int, db: Session = Depends(get_db)):
    # Return average rating and counts
    data = db.query(Review).filter(Review.product_id == product_id).all()
    if not data:
        return {"average_rating": None, "count": 0}
    avg = sum(r.rating for r in data)/len(data)
    return {"average_rating": round(avg, 2), "count": len(data)}
