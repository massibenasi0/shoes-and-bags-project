import logging

import stripe
from sqlalchemy.orm import Session

from app.config import settings
from app.models.order import Order, OrderStatus
from app.models.payment import Payment, PaymentStatus

stripe.api_key = settings.STRIPE_SECRET_KEY

logger = logging.getLogger(__name__)


def handle_stripe_webhook(payload: bytes, sig_header: str, db: Session) -> None:
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except stripe.error.SignatureVerificationError as exc:
        raise ValueError("Invalid Stripe signature") from exc

    event_type = event["type"]
    intent = event["data"]["object"]

    order_id = intent.get("metadata", {}).get("order_id")
    if not order_id:
        return

    payment = (
        db.query(Payment)
        .join(Order)
        .filter(Order.id == order_id)
        .first()
    )
    if not payment:
        logger.warning("No payment record for order %s", order_id)
        return

    if event_type == "payment_intent.succeeded":
        payment.status = PaymentStatus.COMPLETED
        payment.order.status = OrderStatus.CONFIRMED
        user_email = payment.order.user.email
        total = float(payment.amount)
        db.commit()
        _enqueue_confirmation(user_email, order_id, total)

    elif event_type == "payment_intent.payment_failed":
        payment.status = PaymentStatus.FAILED
        last_error = intent.get("last_payment_error") or {}
        payment.failure_reason = last_error.get("message")
        db.commit()


def _enqueue_confirmation(user_email: str, order_id: str, total: float) -> None:
    try:
        from app.tasks.email_tasks import send_order_confirmation
        send_order_confirmation.delay(user_email, order_id, total)
    except Exception:
        logger.exception("Failed to enqueue order confirmation email for order %s", order_id)
