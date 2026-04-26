from datetime import datetime
from decimal import Decimal
from typing import Any, Optional
from uuid import UUID

from pydantic import BaseModel

from app.models.order import OrderStatus


class OrderItemCreate(BaseModel):
    product_id: UUID
    quantity: int
    size: Optional[str] = None
    color: Optional[str] = None


class ShippingAddress(BaseModel):
    street: str
    city: str
    state: str
    zip_code: str
    country: str


class OrderCreate(BaseModel):
    items: list[OrderItemCreate]
    shipping_address: ShippingAddress
    payment_method: str = "stripe"  # "stripe" | "offline"


class OrderStatusUpdate(BaseModel):
    status: OrderStatus


class OrderResponse(BaseModel):
    id: UUID
    user_id: UUID
    status: OrderStatus
    total_amount: Decimal
    shipping_address: Any
    items: Any
    created_at: datetime

    model_config = {"from_attributes": True}
