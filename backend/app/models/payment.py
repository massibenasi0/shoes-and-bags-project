import enum
import uuid

from sqlalchemy import Column, DateTime, Enum as SAEnum, ForeignKey, Numeric, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"
    OFFLINE_PENDING = "offline_pending"
    OFFLINE_APPROVED = "offline_approved"
    OFFLINE_REJECTED = "offline_rejected"


class PaymentMethod(str, enum.Enum):
    STRIPE = "stripe"
    OFFLINE = "offline"


class Payment(Base):
    __tablename__ = "payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), unique=True, nullable=False)
    stripe_payment_intent_id = Column(String(255), nullable=True)
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), default="usd")
    status = Column(SAEnum(PaymentStatus), default=PaymentStatus.PENDING, nullable=False)
    method = Column(SAEnum(PaymentMethod), default=PaymentMethod.STRIPE, nullable=False)
    failure_reason = Column(Text, nullable=True)
    admin_notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    order = relationship("Order", back_populates="payment")
