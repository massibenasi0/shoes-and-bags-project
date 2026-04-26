import re
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.dependencies import get_admin_user
from app.database import get_db
from app.models.product import Product
from app.schemas.product import (
    ProductCreate,
    ProductListResponse,
    ProductResponse,
    ProductUpdate,
)

router = APIRouter(prefix="/api/products", tags=["products"])


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


@router.get("", response_model=ProductListResponse)
def list_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
    category_id: Optional[UUID] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    brand: Optional[str] = None,
    sort_by: Optional[str] = Query(None, pattern="^(price_asc|price_desc|newest|name)$"),
    is_featured: Optional[bool] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Product).filter(Product.is_active == True)  # noqa: E712

    if category_id:
        query = query.filter(Product.category_id == category_id)
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    if brand:
        query = query.filter(Product.brand.ilike(f"%{brand}%"))
    if is_featured is not None:
        query = query.filter(Product.is_featured == is_featured)

    if sort_by == "price_asc":
        query = query.order_by(Product.price.asc())
    elif sort_by == "price_desc":
        query = query.order_by(Product.price.desc())
    elif sort_by == "name":
        query = query.order_by(Product.name.asc())
    else:  # default: newest
        query = query.order_by(Product.created_at.desc())

    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()

    return ProductListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=max(1, (total + page_size - 1) // page_size),
    )


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: UUID, db: Session = Depends(get_db)):
    product = db.query(Product).filter(
        Product.id == product_id, Product.is_active == True  # noqa: E712
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("", response_model=ProductResponse, status_code=201)
def create_product(
    data: ProductCreate,
    db: Session = Depends(get_db),
    _=Depends(get_admin_user),
):
    slug = slugify(data.name)
    # Ensure slug uniqueness
    base_slug = slug
    counter = 1
    while db.query(Product).filter(Product.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    product = Product(**data.model_dump(), slug=slug)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: UUID,
    data: ProductUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_admin_user),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = data.model_dump(exclude_unset=True)
    if "name" in update_data:
        update_data["slug"] = slugify(update_data["name"])

    for key, value in update_data.items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=204)
def delete_product(
    product_id: UUID,
    db: Session = Depends(get_db),
    _=Depends(get_admin_user),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.is_active = False  # soft delete
    db.commit()
