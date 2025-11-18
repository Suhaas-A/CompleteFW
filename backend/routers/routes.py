"""
Main API routes for the Fashion Store backend.

Handles:
- User authentication and registration
- Product management (admin)
- Cart operations
- Order creation and retrieval
"""

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

from backend.db.database import get_db
from backend.model import tables
from backend.schemas import data
from backend.core.config import settings

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
def get_all_products(db: Session = Depends(get_db), current_user=Depends(get_current_active_user)):
    return db.query(tables.Products).all()


@router.get("/product/{product_id}", tags=["products"])
def get_product(product_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_active_user)):
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
    db.query(tables.ProductCart).filter(tables.ProductCart.cart_id == cart.id).delete()
    db.commit()

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
