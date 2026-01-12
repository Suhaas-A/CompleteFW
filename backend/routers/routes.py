"""
Main API routes for the Fashion Store backend.

Handles:
- User authentication and registration
- Product management (admin)
- Cart operations
- Order creation and retrieval
- Order status tracking (history/timeline)
"""

# email -> { otp, expires_at }
OTP_STORE: dict[str, dict] = {}
import random

def generate_otp() -> str:
    return str(random.randint(100000, 999999))


from datetime import datetime, timedelta
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from passlib.context import CryptContext

from db.database import get_db
from model import tables
from schemas import data
from core.config import settings

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_PREFIX}/login")


# ---------------------------- Utility Functions ---------------------------- #

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data_dict: dict, expires_delta: timedelta | None = None) -> str:
    """Generate JWT access token."""
    to_encode = data_dict.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def get_user_by_username(username: str, db: Session):
    return db.query(tables.Users).filter(tables.Users.username == username).first()


def authenticate_user(username: str, password: str, db: Session):
    user = get_user_by_username(username, db)
    if not user or not verify_password(password, user.password):
        return None
    return user


# ---------------------------- Auth Dependencies ---------------------------- #

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Extract and validate current user from JWT token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = get_user_by_username(username, db)
    if user is None:
        raise credentials_exception
    return user


def get_current_active_user(current_user: tables.Users = Depends(get_current_user)):
    return current_user


def admin_required(current_user: tables.Users = Depends(get_current_active_user)):
    if not current_user.admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    return current_user


# ------------------------------ Auth Routes ------------------------------ #

@router.post("/login", response_model=data.Token, tags=["auth"])
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data_dict={"sub": user.username}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register", response_model=data.Register, tags=["auth"])
def register_user(request: data.Register, db: Session = Depends(get_db)):
    """Register a new user."""
    if db.query(tables.Users).filter(tables.Users.username == request.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    if db.query(tables.Users).filter(tables.Users.email == request.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")
    if db.query(tables.Users).filter(tables.Users.phone_number == request.phone_number).first():
        raise HTTPException(status_code=400, detail="Phone number already exists")

    hashed_password = get_password_hash(request.password)
    user = tables.Users(
        username=request.username,
        password=hashed_password,
        email=request.email,
        phone_number=request.phone_number,
        address=request.address,
        admin=request.admin,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # create empty cart for user
    db.add(tables.Carts(user_id=user.id))
    db.commit()

    return request


# ------------------------------ User Routes ------------------------------ #

@router.get("/my_details", tags=["user"])
def get_my_details(current_user: tables.Users = Depends(get_current_active_user)):
    return current_user


# ------------------------------ Product Routes --------------------------- #

@router.get("/all_products", tags=["products"])
def get_all_products(db: Session = Depends(get_db)):
    return db.query(tables.Products).all()


@router.get("/product/{product_id}", tags=["products"])
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(tables.Products).filter(tables.Products.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("/create_product", tags=["products"])
def create_product(product: data.Product, db: Session = Depends(get_db), current_user=Depends(admin_required)):
    """Admin: Create a new product."""
    new_product = tables.Products(**product.dict())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return {"message": "Product created successfully", "id": new_product.id}


@router.put("/edit_product/{product_id}", tags=["products"])
def edit_product(
    product_id: int,
    new_data: data.UpdateProduct,
    db: Session = Depends(get_db),
    current_user=Depends(admin_required),
):
    product = db.query(tables.Products).filter(tables.Products.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    for field, value in new_data.dict().items():
        setattr(product, field, value)

    db.commit()
    return {"message": "Product updated successfully"}


@router.delete("/delete_product/{product_id}", tags=["products"])
def delete_product(product_id: int, db: Session = Depends(get_db), current_user=Depends(admin_required)):
    product = db.query(tables.Products).filter(tables.Products.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}


# ------------------------------ Cart Routes ------------------------------ #

@router.get("/my_cart", tags=["cart"])
def get_my_cart(db: Session = Depends(get_db), current_user=Depends(get_current_active_user)):
    cart = db.query(tables.Carts).filter(tables.Carts.user_id == current_user.id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    cart_items = (
        db.query(tables.ProductCart)
        .filter(tables.ProductCart.cart_id == cart.id)
        .all()
    )

    products = []
    for item in cart_items:
        product = db.query(tables.Products).filter(tables.Products.id == item.product_id).first()
        if product:
            products.append({
                "id": product.id,
                "name": product.name,
                "price": product.price,
                "quantity": item.quantity,
                "photo_link": product.photo_link,
            })

    return {"cart_id": cart.id, "items": products}


@router.post("/add_product_to_cart", tags=["cart"])
def add_product_to_cart(payload: data.Cart, db: Session = Depends(get_db), current_user=Depends(get_current_active_user)):
    cart = db.query(tables.Carts).filter(tables.Carts.user_id == current_user.id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    product = db.query(tables.Products).filter(tables.Products.id == payload.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = (
        db.query(tables.ProductCart)
        .filter(tables.ProductCart.cart_id == cart.id, tables.ProductCart.product_id == payload.product_id)
        .first()
    )

    if existing:
        existing.quantity += payload.quantity
    else:
        db.add(tables.ProductCart(cart_id=cart.id, product_id=payload.product_id, quantity=payload.quantity))

    db.commit()
    return {"message": "Product added to cart"}


@router.post("/edit_quantity", tags=["cart"])
def edit_cart_quantity(payload: data.Cart, db: Session = Depends(get_db), current_user=Depends(get_current_active_user)):
    cart = db.query(tables.Carts).filter(tables.Carts.user_id == current_user.id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    item = (
        db.query(tables.ProductCart)
        .filter(tables.ProductCart.cart_id == cart.id, tables.ProductCart.product_id == payload.product_id)
        .first()
    )

    if not item:
        raise HTTPException(status_code=404, detail="Item not found in cart")

    item.quantity = payload.quantity
    db.commit()
    return {"message": "Cart quantity updated"}


@router.delete("/remove_product/{product_id}", tags=["cart"])
def remove_product_from_cart(product_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_active_user)):
    cart = db.query(tables.Carts).filter(tables.Carts.user_id == current_user.id).first()
    item = (
        db.query(tables.ProductCart)
        .filter(tables.ProductCart.cart_id == cart.id, tables.ProductCart.product_id == product_id)
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Item not found in cart")

    db.delete(item)
    db.commit()
    return {"message": "Product removed from cart"}


# ------------------------------ Order Routes ----------------------------- #

@router.post("/create_order", tags=["orders"])
def create_order(order: data.Order, db: Session = Depends(get_db), current_user=Depends(get_current_active_user)):
    """Create an order from user's cart."""
    new_order = tables.Orders(
        user_id=current_user.id,
        delivery_address=order.deliver_address,
        status="Pending",
        total_amount=order.total_amount,
        delivery_link=order.delivery_link or "N/A",
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    for product_id, qty in order.products:
        db.add(tables.ProductOrder(order_id=new_order.id, product_id=product_id, quantity=qty))

    db.commit()

    # Clear cart after order
    cart = db.query(tables.Carts).filter(tables.Carts.user_id == current_user.id).first()
    if cart:
        db.query(tables.ProductCart).filter(tables.ProductCart.cart_id == cart.id).delete()
        db.commit()

    # Add initial status history entry
    try:
        db.add(tables.OrderStatusHistory(
            order_id=new_order.id,
            status="Pending",
            note="Order created",
            changed_by_user_id=current_user.id
        ))
        db.commit()
    except Exception:
        # don't fail entire order if history insert fails; log if you have logger
        db.rollback()

    return {"message": "Order created successfully", "order_id": new_order.id}


@router.get("/my_orders", tags=["orders"])
def get_my_orders(db: Session = Depends(get_db), current_user=Depends(get_current_active_user)):
    return db.query(tables.Orders).filter(tables.Orders.user_id == current_user.id).all()


@router.get("/order/{order_id}", tags=["orders"])
def get_order_details(order_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_active_user)):
    order = db.query(tables.Orders).filter(tables.Orders.id == order_id).first()
    if not order or order.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Order not found or unauthorized")

    products = (
        db.query(tables.ProductOrder)
        .filter(tables.ProductOrder.order_id == order_id)
        .all()
    )

    product_data = []
    for item in products:
        product = db.query(tables.Products).filter(tables.Products.id == item.product_id).first()
        if product:
            product_data.append({
                "id": product.id,
                "name": product.name,
                "price": product.price,
                "quantity": item.quantity,
                "photo_link": product.photo_link,
            })

    return {"order": order, "products": product_data}


# ---------------------- Order Status: update & timeline -------------------- #

@router.post("/order/{order_id}/update_status", tags=["orders"])
def update_order_status(
    order_id: int,
    payload: data.OrderStatusHistoryCreate,
    db: Session = Depends(get_db),
    admin_user: tables.Users = Depends(admin_required)
):
    order = db.query(tables.Orders).filter(tables.Orders.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Basic validation of status value (you can expand this)
    VALID_STATUSES = {
        "Pending", "Confirmed", "Packed", "Shipped",
        "Out for Delivery", "Delivered", "Cancelled", "Returned", "Refunded"
    }
    if payload.status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status value")

    # update order table
    order.status = payload.status
    db.commit()
    db.refresh(order)

    # add history entry
    try:
        history = tables.OrderStatusHistory(
            order_id=order_id,
            status=payload.status,
            note=payload.note,
            changed_by_user_id=admin_user.id
        )
        db.add(history)
        db.commit()
        db.refresh(history)
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to write status history")

    return {"message": "Order status updated", "history": history}


@router.get("/order/{order_id}/status-history", tags=["orders"])
def get_order_status_history(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: tables.Users = Depends(get_current_active_user)
):
    order = db.query(tables.Orders).filter(tables.Orders.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Users can only view their own orders; Admins can view all
    if not current_user.admin and order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    history = (
        db.query(tables.OrderStatusHistory)
        .filter(tables.OrderStatusHistory.order_id == order_id)
        .order_by(tables.OrderStatusHistory.created_at.asc())
        .all()
    )

    return {
        "order_id": order_id,
        "current_status": order.status,
        "history": history,
    }

# --------------------------- ADMIN: GET ALL ORDERS --------------------------- #

@router.get("/admin/all_orders", tags=["admin"])
def admin_get_all_orders(
    db: Session = Depends(get_db),
    current_user: tables.Users = Depends(admin_required)
):
    """
    Admin can view ALL orders from all users.
    Includes user details for dashboard.
    """
    orders = (
        db.query(tables.Orders)
        .order_by(tables.Orders.created_at.desc())
        .all()
    )

    result = []

    for order in orders:
        user = (
            db.query(tables.Users)
            .filter(tables.Users.id == order.user_id)
            .first()
        )

        result.append({
            "id": order.id,
            "user_id": order.user_id,
            "username": user.username if user else "Unknown",
            "email": user.email if user else None,
            "delivery_address": order.delivery_address,
            "status": order.status,
            "delivery_link": order.delivery_link,
            "created_at": order.created_at
        })

    return result



import smtplib
from email.message import EmailMessage

def send_otp_email(to_email: str, otp: str):
    msg = EmailMessage()
    msg["Subject"] = "Password Reset OTP"
    msg["From"] = "suhaas062010@gmail.com"
    msg["To"] = to_email

    msg.set_content(f"""
        Hello,
        
        Your OTP for resetting password is:
        
        {otp}
        
        This OTP is valid for 10 minutes.
        
        If you did not request this, ignore this email.
    """)

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login("suhaas062010@gmail.com", "ogkl cmnc rnnq rgzj")
        server.send_message(msg)


@router.post("/forgot-password")
def forgot_password(payload: data.ForgotPasswordEmail, db: Session = Depends(get_db)):
    user = db.query(tables.Users).filter(
        tables.Users.email == payload.email
    ).first()

    # Same response to avoid email enumeration
    if not user:
        return {"message": "If the email exists, OTP has been sent"}

    otp = generate_otp()

    OTP_STORE[payload.email] = {
        "otp": otp,
        "expires_at": datetime.utcnow() + timedelta(minutes=10)
    }

    send_otp_email(payload.email, otp)

    return {"message": "If the email exists, OTP has been sent"}



@router.post("/reset-password")
def reset_password(payload: data.ResetPasswordWithOtp, db: Session = Depends(get_db)):
    record = OTP_STORE.get(payload.email)

    if (
        not record
        or record["otp"] != payload.otp
        or record["expires_at"] < datetime.utcnow()
    ):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    user = db.query(tables.Users).filter(
        tables.Users.email == payload.email
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password = get_password_hash(payload.new_password)
    db.commit()

    OTP_STORE.pop(payload.email, None)

    return {"message": "Password updated successfully"}







