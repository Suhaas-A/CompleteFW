from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict

from db.database import get_db
from model.tables import Orders, ProductOrder
from routers.utils import admin_required

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/sales-summary")
def sales_summary(
    db: Session = Depends(get_db),
    _=Depends(admin_required),
) -> Dict:
    """
    SALES SUMMARY (NET REVENUE)

    Rules:
    - EXCLUDE:
        - Pending
        - Payment Pending
    - INCLUDE:
        - Paid
        - Delivered
        - Shipped
        - Any completed status
    - Revenue comes ONLY from orders.total_amount
      (already includes discounts & coupons)
    """

    # -----------------------------
    # VALID REVENUE STATUSES
    # -----------------------------
    EXCLUDED_STATUSES = ["Pending", "Payment Pending"]

    # -----------------------------
    # TOTAL REVENUE (NET)
    # -----------------------------
    total_revenue = (
        db.query(func.coalesce(func.sum(Orders.total_amount), 0))
        .filter(~Orders.status.in_(EXCLUDED_STATUSES))
        .scalar()
    )

    # -----------------------------
    # TOP PRODUCTS (QUANTITY SOLD)
    # -----------------------------
    results = (
        db.query(
            ProductOrder.product_id,
            func.sum(ProductOrder.quantity).label("quantity_sold"),
        )
        .join(Orders, Orders.id == ProductOrder.order_id)
        .filter(~Orders.status.in_(EXCLUDED_STATUSES))
        .group_by(ProductOrder.product_id)
        .order_by(func.sum(ProductOrder.quantity).desc())
        .limit(20)
        .all()
    )

    top_products = [
        {
            "product_id": r.product_id,
            "quantity_sold": int(r.quantity_sold),
        }
        for r in results
    ]

    return {
        "total_revenue": float(total_revenue),
        "top_products": top_products,
    }
