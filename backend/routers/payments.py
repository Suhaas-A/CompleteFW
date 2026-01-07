import uuid
import hmac
import hashlib
import requests
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from db.database import get_db
from model.tables import (
    Orders,
    Payment,
    OrderStatusHistory,
    Users,
)
from schemas.data import (
    PaymentIntentCreate,
    PaymentConfirm,
)
from routers.utils import get_current_active_user
from core.config import settings

router = APIRouter(prefix="/payments", tags=["Payments"])


# ---------------------------------------------------------
# CREATE PAYMENT SESSION (Cashfree)
# ---------------------------------------------------------
@router.post("/create", status_code=status.HTTP_201_CREATED)
def create_payment(
    payload: PaymentIntentCreate,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_active_user),
):
    # 1️⃣ Validate order
    order = (
        db.query(Orders)
        .filter(
            Orders.id == payload.order_id,
            Orders.user_id == current_user.id,
        )
        .first()
    )

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # 2️⃣ Create internal payment id
    provider_payment_id = str(uuid.uuid4())

    # 3️⃣ Create Cashfree order
    cf_payload = {
        "order_id": provider_payment_id,
        "order_amount": payload.amount,
        "order_currency": "INR",
        "customer_details": {
            "customer_id": str(current_user.id),
            "customer_email": current_user.email,
            "customer_phone": current_user.phone_number or "9999999999",
        },
    }

    headers = {
        "Content-Type": "application/json",
        "x-client-id": settings.CASHFREE_CLIENT_ID,
        "x-client-secret": settings.CASHFREE_CLIENT_SECRET,
        "x-api-version": "2022-09-01",
    }

    response = requests.post(
        settings.CASHFREE_ORDER_URL,
        json=cf_payload,
        headers=headers,
        timeout=15,
    )

    if response.status_code != 200:
        raise HTTPException(
            status_code=400,
            detail="Cashfree order creation failed",
        )

    cf_data = response.json()

    # 4️⃣ Save payment (pending)
    payment = Payment(
        order_id=order.id,
        provider="cashfree",
        provider_payment_id=provider_payment_id,
        amount=payload.amount,
        currency="INR",
        status="pending",
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)

    return {
        "payment_session_id": cf_data["payment_session_id"],
        "order_id": order.id,
        "payment_id": payment.id,
    }


# ---------------------------------------------------------
# VERIFY PAYMENT (Frontend polling / redirect)
# ---------------------------------------------------------
@router.post("/confirm", status_code=status.HTTP_200_OK)
def confirm_payment(
    payload: PaymentConfirm,
    db: Session = Depends(get_db),
):
    payment = (
        db.query(Payment)
        .filter(Payment.provider_payment_id == payload.provider_payment_id)
        .first()
    )

    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    order = db.query(Orders).filter(Orders.id == payment.order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Update payment & order
    if payload.status.lower() == "success":
        payment.status = "success"
        order.status = "Paid"

        history = OrderStatusHistory(
            order_id=order.id,
            status="Paid",
            note="Payment successful",
        )
        db.add(history)

    else:
        payment.status = "failed"
        order.status = "Payment Failed"

        history = OrderStatusHistory(
            order_id=order.id,
            status="Payment Failed",
            note="Payment failed or cancelled",
        )
        db.add(history)

    db.commit()

    return {
        "order_status": order.status,
        "payment_status": payment.status,
    }


# ---------------------------------------------------------
# CASHFREE WEBHOOK (PRODUCTION SAFE)
# ---------------------------------------------------------
@router.post("/webhook", status_code=200)
async def cashfree_webhook(
    request: Request,
    db: Session = Depends(get_db),
):
    raw_body = await request.body()
    signature = request.headers.get("x-webhook-signature")

    if not signature:
        raise HTTPException(status_code=400, detail="Missing signature")

    # Verify signature
    expected_sig = hmac.new(
        settings.CASHFREE_WEBHOOK_SECRET.encode(),
        raw_body,
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(expected_sig, signature):
        raise HTTPException(status_code=400, detail="Invalid signature")

    payload = await request.json()

    provider_payment_id = payload.get("order_id")
    payment_status = payload.get("order_status")

    payment = (
        db.query(Payment)
        .filter(Payment.provider_payment_id == provider_payment_id)
        .first()
    )

    if not payment:
        return {"message": "Payment not found"}

    order = db.query(Orders).filter(Orders.id == payment.order_id).first()

    if payment_status == "PAID":
        payment.status = "success"
        order.status = "Paid"

        history = OrderStatusHistory(
            order_id=order.id,
            status="Paid",
            note="Confirmed via Cashfree webhook",
        )
        db.add(history)

    elif payment_status in ("FAILED", "CANCELLED"):
        payment.status = "failed"
        order.status = "Payment Failed"

        history = OrderStatusHistory(
            order_id=order.id,
            status="Payment Failed",
            note="Webhook failure",
        )
        db.add(history)

    db.commit()
    return {"message": "Webhook processed"}

