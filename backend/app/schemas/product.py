from datetime import datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: Decimal
    compare_at_price: Optional[Decimal] = None
    category_id: UUID
    images: list[str] = []
    sizes: list[str] = []
    colors: list[str] = []
    stock: int = 0
    is_featured: bool = False
    brand: Optional[str] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    compare_at_price: Optional[Decimal] = None
    category_id: Optional[UUID] = None
    images: Optional[list[str]] = None
    sizes: Optional[list[str]] = None
    colors: Optional[list[str]] = None
    stock: Optional[int] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None
    brand: Optional[str] = None


class ProductResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    description: Optional[str]
    price: Decimal
    compare_at_price: Optional[Decimal]
    category_id: UUID
    images: list[str]
    sizes: list[str]
    colors: list[str]
    stock: int
    is_featured: bool
    is_active: bool
    brand: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class ProductListResponse(BaseModel):
    items: list[ProductResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
