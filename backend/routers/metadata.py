# backend/routers/metadata_routes.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.db.database import get_db
from backend.model import tables
from backend.schemas import data as schemas

router = APIRouter(prefix="/api", tags=["Metadata"])

# ----------------------------
# 🔸 CATEGORY
# ----------------------------
@router.post("/post_category", status_code=201)
def post_category(category: schemas.CategoryBase, db: Session = Depends(get_db)):
    new_category = tables.Categories(name=category.name)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category


@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    return db.query(tables.Categories).all()


# ----------------------------
# 🔸 COLOR
# ----------------------------
@router.post("/post_color", status_code=201)
def post_color(color: schemas.ColorBase, db: Session = Depends(get_db)):
    new_color = tables.Colors(name=color.name)
    db.add(new_color)
    db.commit()
    db.refresh(new_color)
    return new_color


@router.get("/colors")
def get_colors(db: Session = Depends(get_db)):
    return db.query(tables.Colors).all()


# ----------------------------
# 🔸 SIZE
# ----------------------------
@router.post("/post_size", status_code=201)
def post_size(size: schemas.SizeBase, db: Session = Depends(get_db)):
    new_size = tables.Sizes(name=size.name)
    db.add(new_size)
    db.commit()
    db.refresh(new_size)
    return new_size


@router.get("/sizes")
def get_sizes(db: Session = Depends(get_db)):
    return db.query(tables.Sizes).all()


# ----------------------------
# 🔸 MATERIAL
# ----------------------------
@router.post("/post_material", status_code=201)
def post_material(material: schemas.MaterialBase, db: Session = Depends(get_db)):
    new_material = tables.Materials(name=material.name)
    db.add(new_material)
    db.commit()
    db.refresh(new_material)
    return new_material


@router.get("/materials")
def get_materials(db: Session = Depends(get_db)):
    return db.query(tables.Materials).all()


# ----------------------------
# 🔸 PACK
# ----------------------------
@router.post("/post_pack", status_code=201)
def post_pack(pack: schemas.PackBase, db: Session = Depends(get_db)):
    new_pack = tables.Packs(name=pack.name, number=pack.number)
    db.add(new_pack)
    db.commit()
    db.refresh(new_pack)
    return new_pack


@router.get("/packs")
def get_packs(db: Session = Depends(get_db)):
    return db.query(tables.Packs).all()


# ----------------------------
# 🔸 PATTERN
# ----------------------------
@router.post("/post_pattern", status_code=201)
def post_pattern(pattern: schemas.PatternBase, db: Session = Depends(get_db)):
    new_pattern = tables.Patterns(name=pattern.name)
    db.add(new_pattern)
    db.commit()
    db.refresh(new_pattern)
    return new_pattern


@router.get("/patterns")
def get_patterns(db: Session = Depends(get_db)):
    return db.query(tables.Patterns).all()


# ----------------------------
# 🔸 DISCOUNT
# ----------------------------
@router.post("/post_discount", status_code=201)
def post_discount(discount: schemas.DiscountBase, db: Session = Depends(get_db)):
    new_discount = tables.Discounts(name=discount.name, prop=discount.prop)
    db.add(new_discount)
    db.commit()
    db.refresh(new_discount)
    return new_discount


@router.get("/discounts")
def get_discounts(db: Session = Depends(get_db)):
    return db.query(tables.Discounts).all()


# ----------------------------
# 🔸 COUPON
# ----------------------------
@router.post("/post_coupon", status_code=201)
def post_coupon(coupon: schemas.CouponBase, db: Session = Depends(get_db)):
    new_coupon = tables.Coupons(name=coupon.name, offer=coupon.offer)
    db.add(new_coupon)
    db.commit()
    db.refresh(new_coupon)
    return new_coupon


@router.get("/coupons")
def get_coupons(db: Session = Depends(get_db)):
    return db.query(tables.Coupons).all()
