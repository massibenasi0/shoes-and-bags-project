import enum
import uuid

from sqlalchemy import Column, DateTime, Enum as SAEnum, ForeignKey, JSON, Numeric, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class Order(Base):
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    status = Column(SAEnum(OrderStatus), default=OrderStatus.PENDING, nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)
    # {street, city, state, zip_code, country}
    shipping_address = Column(JSON, nullable=False)
    # [{product_id, name, quantity, price, size, color}]
    items = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="orders")
    payment = relationship("Payment", back_populates="order", uselist=False)
