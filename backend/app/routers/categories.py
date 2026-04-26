from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_admin_user
from app.database import get_db
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryResponse

router = APIRouter(prefix="/api/categories", tags=["categories"])


@router.get("", response_model=list[CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()


@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(category_id: str, db: Session = Depends(get_db)):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    return cat


@router.post("", response_model=CategoryResponse, status_code=201)
def create_category(
    data: CategoryCreate,
    db: Session = Depends(get_db),
    _=Depends(get_admin_user),
):
    if db.query(Category).filter(Category.slug == data.slug).first():
        raise HTTPException(status_code=400, detail="Slug already exists")
    cat = Category(**data.model_dump())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


@router.delete("/{category_id}", status_code=204)
def delete_category(
    category_id: str,
    db: Session = Depends(get_db),
    _=Depends(get_admin_user),
):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(cat)
    db.commit()
