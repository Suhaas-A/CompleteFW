# backend/routers/payments.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from db.database import get_db
from model.tables import Orders, Payment
from schemas.data import PaymentIntentCreate, PaymentConfirm
from routers.utils import get_current_active_user
from core.config import settings

router = APIRouter(prefix="/payments", tags=["payments"])

@router.post("/create-intent")
def create_payment_intent(payload: PaymentIntentCreate, db: Session = Depends(get_db), current_user=Depends(get_current_active_user)):
    # validate order belongs to user
    order = db.query(Orders).filter(Orders.id == payload.order_id, Orders.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    # Here integrate with provider (Stripe, Razorpay...). This is a stub:
    provider = payload.provider or "stripe"
    # For stripe you would use stripe.PaymentIntent.create(...)
    fake_client_secret = "client_secret_example_123"  # Replace with actual provider response

    # create Payment record
    payment = Payment(order_id=order.id, provider=provider, amount=payload.amount, currency=payload.currency, status="pending")
    db.add(payment)
    db.commit()
    db.refresh(payment)

    return {"client_secret": fake_client_secret, "payment_id": payment.id}

@router.post("/confirm")
def confirm_payment(payload: PaymentConfirm, db: Session = Depends(get_db)):
    # find payment by order id (or provider_payment_id)
    payment = db.query(Payment).filter(Payment.order_id == payload.order_id).order_by(Payment.created_at.desc()).first()
    if not payment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment record not found")

    payment.provider_payment_id = payload.provider_payment_id
    payment.status = payload.status
    db.commit()

    # Optionally mark order status as paid
    if payload.status == "succeeded":
        order = db.query(Orders).filter(Orders.id == payload.order_id).first()
        if order:
            order.status = "Confirmed"
            db.commit()

    return {"message": "Payment updated", "status": payment.status}

