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
    _=Depends(admin_required)
) -> Dict:
    """
    Returns:
    - total_revenue: sum of final paid order amounts (after discounts & coupons)
    - top_products: quantity sold per product (paid orders only)
    """

    # ✅ TOTAL REVENUE (authoritative)
    total_revenue = (
        db.query(func.coalesce(func.sum(Orders.total_amount), 0))
        .filter(Orders.status == "Paid")
        .scalar()
    )

    # ✅ TOP PRODUCTS (quantity sold from paid orders only)
    results = (
        db.query(
            ProductOrder.product_id,
            func.sum(ProductOrder.quantity).label("quantity_sold")
        )
        .join(Orders, Orders.id == ProductOrder.order_id)
        .filter(Orders.status == "Paid")
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
