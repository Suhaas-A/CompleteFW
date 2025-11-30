"""
SQLAlchemy models for the Fashion Store backend.
Enhanced with OrderStatusHistory tracking.
Target: Python 3.11
"""

from __future__ import annotations
from datetime import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Boolean,
    DateTime,
    ForeignKey,
    Float,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()


# ------------------------------ Core models ----------------------------- #

class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(150), unique=True, nullable=False, index=True)
    password = Column(String(256), nullable=False)
    email = Column(String(256), unique=True, nullable=False, index=True)
    phone_number = Column(String(32), unique=True, nullable=True)
    address = Column(Text, nullable=True)
    admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    carts = relationship("Carts", back_populates="user", cascade="all,delete-orphan")
    orders = relationship("Orders", back_populates="user", cascade="all,delete-orphan")
    wishlists = relationship("Wishlist", back_populates="user", cascade="all,delete-orphan")
    reviews = relationship("Review", back_populates="user", cascade="all,delete-orphan")
    addresses = relationship("Address", back_populates="user", cascade="all,delete-orphan")
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all,delete-orphan")

    # NEW → track which admin/user changed status
    status_changes = relationship(
        "OrderStatusHistory",
        back_populates="changed_by_user",
        foreign_keys="OrderStatusHistory.changed_by_user_id"
    )

    def __repr__(self):
        return f"<User id={self.id} username={self.username}>"


# ----------------------------- Metadata tables --------------------------- #

class Categories(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True)
    name = Column(String(128), nullable=False, unique=True)
    products = relationship("Products", back_populates="category")


class Sizes(Base):
    __tablename__ = "sizes"
    id = Column(Integer, primary_key=True)
    name = Column(String(64), nullable=False, unique=True)
    products = relationship("Products", back_populates="size_obj")


class Coupons(Base):
    __tablename__ = "coupons"
    id = Column(Integer, primary_key=True)
    name = Column(String(128), nullable=False, unique=True)
    offer = Column(Integer, nullable=False)
    products = relationship("Products", back_populates="coupon")


class Discounts(Base):
    __tablename__ = "discounts"
    id = Column(Integer, primary_key=True)
    name = Column(String(128), nullable=False, unique=True)
    prop = Column(String(128), nullable=True)
    products = relationship("Products", back_populates="discount")


class Patterns(Base):
    __tablename__ = "patterns"
    id = Column(Integer, primary_key=True)
    name = Column(String(128), nullable=False, unique=True)
    products = relationship("Products", back_populates="pattern")


class Colors(Base):
    __tablename__ = "colors"
    id = Column(Integer, primary_key=True)
    name = Column(String(128), nullable=False, unique=True)
    products = relationship("Products", back_populates="color")


class Materials(Base):
    __tablename__ = "materials"
    id = Column(Integer, primary_key=True)
    name = Column(String(128), nullable=False, unique=True)
    products = relationship("Products", back_populates="material")


class Packs(Base):
    __tablename__ = "packs"
    id = Column(Integer, primary_key=True)
    name = Column(String(128), nullable=False)
    number = Column(Integer, nullable=True)
    products = relationship("Products", back_populates="pack")


# ----------------------------- Product models ---------------------------- #

class Products(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True)
    name = Column(String(256), nullable=False, index=True)
    price = Column(Float, nullable=False)
    description = Column(Text, nullable=True)
    photo_link = Column(String(1024), nullable=True)
    stock = Column(Boolean, default=True)

    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    size_id = Column(Integer, ForeignKey("sizes.id"), nullable=True)
    coupon_id = Column(Integer, ForeignKey("coupons.id"), nullable=True)
    discount_id = Column(Integer, ForeignKey("discounts.id"), nullable=True)
    pattern_id = Column(Integer, ForeignKey("patterns.id"), nullable=True)
    color_id = Column(Integer, ForeignKey("colors.id"), nullable=True)
    material_id = Column(Integer, ForeignKey("materials.id"), nullable=True)
    pack_id = Column(Integer, ForeignKey("packs.id"), nullable=True)

    category = relationship("Categories", back_populates="products")
    size_obj = relationship("Sizes", back_populates="products")
    coupon = relationship("Coupons", back_populates="products")
    discount = relationship("Discounts", back_populates="products")
    pattern = relationship("Patterns", back_populates="products")
    color = relationship("Colors", back_populates="products")
    material = relationship("Materials", back_populates="products")
    pack = relationship("Packs", back_populates="products")

    cart_items = relationship("ProductCart", back_populates="product", cascade="all,delete-orphan")
    order_items = relationship("ProductOrder", back_populates="product", cascade="all,delete-orphan")
    reviews = relationship("Review", back_populates="product", cascade="all,delete-orphan")

    def __repr__(self):
        return f"<Product id={self.id} name={self.name}>"


# ----------------------------- Cart models ------------------------------- #

class Carts(Base):
    __tablename__ = "carts"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("Users", back_populates="carts")
    items = relationship("ProductCart", back_populates="cart", cascade="all,delete-orphan")


class ProductCart(Base):
    __tablename__ = "product_carts"
    __table_args__ = (UniqueConstraint("cart_id", "product_id", name="uq_cart_product"),)

    id = Column(Integer, primary_key=True)
    cart_id = Column(Integer, ForeignKey("carts.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)

    cart = relationship("Carts", back_populates="items")
    product = relationship("Products", back_populates="cart_items")


# ----------------------------- Order models ------------------------------ #

class Orders(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    delivery_address = Column(Text)
    status = Column(String(64), nullable=False, default="Pending")  # keep original
    delivery_link = Column(String(1024))
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("Users", back_populates="orders")
    items = relationship("ProductOrder", back_populates="order", cascade="all,delete-orphan")
    payments = relationship("Payment", back_populates="order", cascade="all,delete-orphan")
    invoices = relationship("Invoice", back_populates="order", cascade="all,delete-orphan")

    # NEW: timeline history
    status_history = relationship(
        "OrderStatusHistory",
        back_populates="order",
        cascade="all, delete-orphan",
        order_by="OrderStatusHistory.created_at"
    )


class ProductOrder(Base):
    __tablename__ = "product_orders"
    __table_args__ = (UniqueConstraint("order_id", "product_id", name="uq_order_product"),)

    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)

    order = relationship("Orders", back_populates="items")
    product = relationship("Products", back_populates="order_items")


# ----------------------------- NEW: Status History ------------------------------ #

class OrderStatusHistory(Base):
    __tablename__ = "order_status_history"

    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False, index=True)
    status = Column(String(64), nullable=False)
    note = Column(Text, nullable=True)

    changed_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    order = relationship("Orders", back_populates="status_history")
    changed_by_user = relationship("Users", back_populates="status_changes")


# ----------------------------- Wishlist / Review ------------------------------ #

class Wishlist(Base):
    __tablename__ = "wishlists"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("Users", back_populates="wishlists")
    product = relationship("Products")


class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("Users", back_populates="reviews")
    product = relationship("Products", back_populates="reviews")


# ----------------------------- Address / Payment / Invoice ------------------------------ #

class Address(Base):
    __tablename__ = "addresses"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    label = Column(String(64))
    name = Column(String(128), nullable=False)
    phone_number = Column(String(32), nullable=False)
    address_line = Column(Text, nullable=False)
    city = Column(String(128))
    state = Column(String(128))
    postal_code = Column(String(32))
    country = Column(String(64))
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("Users", back_populates="addresses")


class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    provider = Column(String(64), nullable=False)
    provider_payment_id = Column(String(256))
    amount = Column(Float, nullable=False)
    currency = Column(String(8), default="INR")
    status = Column(String(32), default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)

    order = relationship("Orders", back_populates="payments")


class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    invoice_number = Column(String(64), nullable=False, unique=True)
    file_path = Column(String(512))
    created_at = Column(DateTime, default=datetime.utcnow)

    order = relationship("Orders", back_populates="invoices")


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token = Column(String(512), nullable=False, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    revoked = Column(Boolean, default=False)

    user = relationship("Users", back_populates="refresh_tokens")
