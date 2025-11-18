# backend/routers/admin_reports.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict

from db.database import get_db
from model.tables import Orders, ProductOrder, Products
from routers.utils import admin_required

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/sales-summary")
def sales_summary(db: Session = Depends(get_db), _ = Depends(admin_required)) -> Dict:
    # Sales per product (quantity sold)
    results = (
        db.query(ProductOrder.product_id, func.sum(ProductOrder.quantity).label("total_qty"))
        .join(Products, Products.id == ProductOrder.product_id)
        .group_by(ProductOrder.product_id)
        .order_by(func.sum(ProductOrder.quantity).desc())
        .limit(20)
        .all()
    )

    top_products = [{"product_id": r.product_id, "quantity_sold": int(r.total_qty)} for r in results]

    # total revenue
    revenue = (
        db.query(func.sum(ProductOrder.quantity * Products.price))
        .join(Products, Products.id == ProductOrder.product_id)
        .scalar() or 0
    )

    return {"top_products": top_products, "total_revenue": float(revenue)}

