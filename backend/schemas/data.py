"""
Pydantic schemas for the Fashion Store backend.

This file contains all request/response schemas used across the API.
Target: Python 3.11

Notes:
- Many models enable `orm_mode = True` so you can return SQLAlchemy model instances directly.
- Keep this file in `backend/schemas/data.py`.
"""

from __future__ import annotations
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime


# ---------------------------- Authentication ---------------------------- #

class Token(BaseModel):
    """JWT access token returned after successful authentication."""
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """Data stored in the JWT token payload."""
    username: Optional[str] = None


# ------------------------------ User Models ----------------------------- #

class User(BaseModel):
    """Safe user representation for API responses."""
    id: Optional[int] = None
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    address: Optional[str] = None
    phone_number: Optional[str] = None
    admin: Optional[bool] = False

    class Config:
        orm_mode = True


class Register(BaseModel):
    """Schema used for user registration and profile edits."""
    username: str
    password: str
    email: str
    address: str
    admin: bool = False
    phone_number: str

    class Config:
        orm_mode = True


# ----------------------------- Order Models ----------------------------- #

class Order(BaseModel):
    """Schema for placing orders."""
    deliver_address: str
    products: List[List[int]]  # [[product_id, quantity]]
    delivery_link: Optional[str] = None
    status: Optional[str] = "Pending",
    total_amount: int,

    class Config:
        orm_mode = True


# ----------------------------- Product Models --------------------------- #

class Product(BaseModel):
    name: str
    price: int
    description: Optional[str] = None
    photo_link: Optional[str] = None

    # 🧩 Foreign key relations (all optional)
    category_id: Optional[int] = None
    size_id: Optional[int] = None
    coupon_id: Optional[int] = None
    discount_id: Optional[int] = None
    pattern_id: Optional[int] = None
    color_id: Optional[int] = None
    material_id: Optional[int] = None
    pack_id: Optional[int] = None

    class Config:
        from_attributes = True  # replaces orm_mode=True in Pydantic v2


class UpdateProduct(BaseModel):
    name: Optional[str] = None
    price: Optional[int] = None
    description: Optional[str] = None
    photo_link: Optional[str] = None

    category_id: Optional[int] = None
    size_id: Optional[int] = None
    coupon_id: Optional[int] = None
    discount_id: Optional[int] = None
    pattern_id: Optional[int] = None
    color_id: Optional[int] = None
    material_id: Optional[int] = None
    pack_id: Optional[int] = None

    class Config:
        from_attributes = True



# ------------------------------ Cart Models ----------------------------- #

class Cart(BaseModel):
    product_id: int
    quantity: int = Field(..., ge=1)


class CartDelete(BaseModel):
    product_id: int


# ------------------------------ Miscellaneous -------------------------- #

class Test(BaseModel):
    product_id: int
    order_id: int
    quantity: int


# --------------------------- Metadata Schemas --------------------------- #

class Category(BaseModel):
    name: str


class Size(BaseModel):
    name: str


class Coupon(BaseModel):
    name: str
    offer: int


class Discount(BaseModel):
    name: str
    prop: str


class Pattern(BaseModel):
    name: str


class Color(BaseModel):
    name: str


class Pack(BaseModel):
    name: str
    number: int


class Material(BaseModel):
    name: str


# --------------------------- Wishlist / Reviews ------------------------- #

class WishlistCreate(BaseModel):
    product_id: int


class WishlistOut(BaseModel):
    id: int
    user_id: int
    product_id: int
    created_at: Optional[datetime]

    class Config:
        orm_mode = True


class ReviewCreate(BaseModel):
    product_id: int
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None


class ReviewOut(BaseModel):
    id: int
    user_id: int
    product_id: int
    rating: int
    comment: Optional[str]
    created_at: Optional[datetime]
    username: str

    class Config:
        orm_mode = True


# ------------------------------ Address Models -------------------------- #

class AddressCreate(BaseModel):
    label: Optional[str] = None
    name: str
    phone_number: str
    address_line: str
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    is_default: Optional[bool] = False


class AddressOut(AddressCreate):
    id: int
    user_id: int
    created_at: Optional[datetime]

    class Config:
        orm_mode = True


# --------------------------- Payment / Invoice -------------------------- #

class PaymentIntentCreate(BaseModel):
    order_id: int
    amount: float
    currency: str = "INR"
    provider: str = "cashfree"
    customer_phone: str


class PaymentConfirm(BaseModel):
    order_id: int
    provider_payment_id: str
    status: str


class InvoiceOut(BaseModel):
    id: int
    order_id: int
    invoice_number: str
    file_path: Optional[str]

    class Config:
        orm_mode = True

from pydantic import BaseModel

class CategoryBase(BaseModel):
    name: str

class ColorBase(BaseModel):
    name: str

class SizeBase(BaseModel):
    name: str

class MaterialBase(BaseModel):
    name: str

class PackBase(BaseModel):
    name: str
    number: int

class PatternBase(BaseModel):
    name: str

class DiscountBase(BaseModel):
    name: str
    prop: str

class CouponBase(BaseModel):
    name: str
    offer: str

# -------------------------- Order Status History -------------------------- #

class OrderStatusHistoryCreate(BaseModel):
    """Used when admin/user updates order status."""
    status: str
    note: Optional[str] = None

    class Config:
        orm_mode = True


class OrderStatusHistoryOut(BaseModel):
    """Single history entry returned to frontend."""
    id: int
    order_id: int
    status: str
    note: Optional[str]
    changed_by_user_id: Optional[int]
    created_at: datetime

    class Config:
        orm_mode = True


class OrderStatusTimelineOut(BaseModel):
    """Returned when viewing order details with status timeline."""
    order_id: int
    current_status: str
    history: List[OrderStatusHistoryOut]

    class Config:
        orm_mode = True






