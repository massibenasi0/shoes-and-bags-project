import logging
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_admin_user, get_current_user
from app.database import get_db
from app.models.order import Order, OrderStatus
from app.models.payment import Payment, PaymentStatus
from app.models.user import User
from app.schemas.payment import OfflinePaymentApproval, PaymentResponse
from app.services.payment import handle_stripe_webhook

router = APIRouter(prefix="/api/payments", tags=["payments"])

logger = logging.getLogger(__name__)


@router.post("/stripe/webhook", include_in_schema=False)
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")
    try:
        handle_stripe_webhook(payload, sig_header, db)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return {"received": True}


@router.get("/order/{order_id}", response_model=PaymentResponse)
def get_payment_for_order(
    order_id: UUID,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    payment = (
        db.query(Payment)
        .join(Order)
        .filter(Order.id == order_id, Order.user_id == user.id)
        .first()
    )
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment


@router.post("/offline/{order_id}/review", status_code=status.HTTP_200_OK)
def review_offline_payment(
    order_id: UUID,
    body: OfflinePaymentApproval,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    payment = (
        db.query(Payment)
        .join(Order)
        .filter(Order.id == order_id)
        .first()
    )
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    if payment.status != PaymentStatus.OFFLINE_PENDING:
        raise HTTPException(status_code=400, detail="Payment already reviewed")

    if body.action == "approve":
        payment.status = PaymentStatus.OFFLINE_APPROVED
        payment.order.status = OrderStatus.CONFIRMED
    elif body.action == "reject":
        payment.status = PaymentStatus.OFFLINE_REJECTED
    else:
        raise HTTPException(status_code=400, detail="action must be 'approve' or 'reject'")

    if body.admin_notes:
        payment.admin_notes = body.admin_notes

    user_email = payment.order.user.email
    db.commit()

    try:
        from app.tasks.email_tasks import send_payment_update
        send_payment_update.delay(user_email, str(payment.order_id), payment.status.value)
    except Exception:
        logger.exception("Failed to enqueue payment update email")

    return {"message": f"Payment {body.action}d successfully"}
