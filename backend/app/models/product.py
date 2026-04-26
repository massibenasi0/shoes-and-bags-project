import uuid

from sqlalchemy import (
    Boolean, Column, DateTime, ForeignKey, Integer, Numeric, String, Text,
)
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    compare_at_price = Column(Numeric(10, 2), nullable=True)
    category_id = Column(UUID(as_uuid=True), ForeignKey("categories.id"), nullable=False)
    images = Column(ARRAY(String), default=[])
    sizes = Column(ARRAY(String), default=[])
    colors = Column(ARRAY(String), default=[])
    stock = Column(Integer, default=0)
    is_featured = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    brand = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    category = relationship("Category", back_populates="products")
