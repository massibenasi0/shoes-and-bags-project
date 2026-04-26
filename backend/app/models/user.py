import enum
import uuid

from sqlalchemy import Boolean, Column, DateTime, Enum as SAEnum, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class UserRole(str, enum.Enum):
    CUSTOMER = "customer"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=True)  # null for OAuth-only users
    full_name = Column(String(255), nullable=False)
    role = Column(SAEnum(UserRole), default=UserRole.CUSTOMER, nullable=False)
    is_active = Column(Boolean, default=True)
    oauth_provider = Column(String(50), nullable=True)
    oauth_id = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    orders = relationship("Order", back_populates="user")
