from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from db.database import get_db
from model import tables
from schemas import data as schemas

router = APIRouter(prefix="/api", tags=["Metadata"])

# =====================================================
# 🔸 CATEGORY
# =====================================================
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


@router.delete("/delete_category/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    category = (
        db.query(tables.Categories)
        .filter(tables.Categories.id == category_id)
        .first()
    )

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    linked_products = (
        db.query(tables.Products)
        .filter(tables.Products.category_id == category_id)
        .count()
    )

    if linked_products > 0:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete category with assigned products"
        )

    db.delete(category)
    db.commit()


# =====================================================
# 🔸 COLOR
# =====================================================
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


@router.delete("/delete_color/{color_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_color(color_id: int, db: Session = Depends(get_db)):
    color = db.query(tables.Colors).filter(tables.Colors.id == color_id).first()
    if not color:
        raise HTTPException(status_code=404, detail="Color not found")
    db.delete(color)
    db.commit()


# =====================================================
# 🔸 SIZE
# =====================================================
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


@router.delete("/delete_size/{size_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_size(size_id: int, db: Session = Depends(get_db)):
    size = db.query(tables.Sizes).filter(tables.Sizes.id == size_id).first()
    if not size:
        raise HTTPException(status_code=404, detail="Size not found")
    db.delete(size)
    db.commit()


# =====================================================
# 🔸 MATERIAL
# =====================================================
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


@router.delete("/delete_material/{material_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_material(material_id: int, db: Session = Depends(get_db)):
    material = db.query(tables.Materials).filter(tables.Materials.id == material_id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    db.delete(material)
    db.commit()


# =====================================================
# 🔸 PACK
# =====================================================
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


@router.delete("/delete_pack/{pack_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pack(pack_id: int, db: Session = Depends(get_db)):
    pack = db.query(tables.Packs).filter(tables.Packs.id == pack_id).first()
    if not pack:
        raise HTTPException(status_code=404, detail="Pack not found")
    db.delete(pack)
    db.commit()


# =====================================================
# 🔸 PATTERN
# =====================================================
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


@router.delete("/delete_pattern/{pattern_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pattern(pattern_id: int, db: Session = Depends(get_db)):
    pattern = db.query(tables.Patterns).filter(tables.Patterns.id == pattern_id).first()
    if not pattern:
        raise HTTPException(status_code=404, detail="Pattern not found")
    db.delete(pattern)
    db.commit()


# =====================================================
# 🔸 DISCOUNT
# =====================================================
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


@router.delete("/delete_discount/{discount_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_discount(discount_id: int, db: Session = Depends(get_db)):
    discount = db.query(tables.Discounts).filter(tables.Discounts.id == discount_id).first()
    if not discount:
        raise HTTPException(status_code=404, detail="Discount not found")
    db.delete(discount)
    db.commit()


# =====================================================
# 🔸 COUPON
# =====================================================
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


@router.delete("/delete_coupon/{coupon_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_coupon(coupon_id: int, db: Session = Depends(get_db)):
    coupon = db.query(tables.Coupons).filter(tables.Coupons.id == coupon_id).first()
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")
    db.delete(coupon)
    db.commit()
