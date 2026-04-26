from datetime import datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from app.models.payment import PaymentMethod, PaymentStatus


class PaymentResponse(BaseModel):
    id: UUID
    order_id: UUID
    stripe_payment_intent_id: Optional[str]
    amount: Decimal
    currency: str
    status: PaymentStatus
    method: PaymentMethod
    failure_reason: Optional[str]
    admin_notes: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class PaymentIntentResponse(BaseModel):
    client_secret: str
    payment_intent_id: str


class OfflinePaymentApproval(BaseModel):
    action: str  # "approve" | "reject"
    admin_notes: Optional[str] = None
