import logging
from decimal import Decimal

import stripe
from sqlalchemy.orm import Session

from app.config import settings
from app.models.order import Order, OrderStatus
from app.models.payment import Payment, PaymentMethod, PaymentStatus
from app.models.product import Product
from app.models.user import User
from app.schemas.order import OrderCreate

stripe.api_key = settings.STRIPE_SECRET_KEY

logger = logging.getLogger(__name__)


def create_order(db: Session, order_data: OrderCreate, user: User) -> tuple[Order, str | None]:
    """Create an order + payment record. Returns (order, stripe_client_secret | None)."""
    items = []
    total = Decimal("0.00")

    for item in order_data.items:
        product = (
            db.query(Product)
            .filter(Product.id == item.product_id, Product.is_active == True)
            .first()
        )
        if not product:
            raise ValueError(f"Product {item.product_id} not found or unavailable")

        items.append({
            "product_id": str(item.product_id),
            "name": product.name,
            "quantity": item.quantity,
            "price": float(product.price),
            "size": item.size,
            "color": item.color,
        })
        total += product.price * item.quantity

    order = Order(
        user_id=user.id,
        status=OrderStatus.PENDING,
        total_amount=total,
        shipping_address=order_data.shipping_address.model_dump(),
        items=items,
    )
    db.add(order)
    db.flush()

    if order_data.payment_method == "stripe":
        client_secret = None
        payment_intent_id = None

        if settings.STRIPE_SECRET_KEY:
            try:
                intent = stripe.PaymentIntent.create(
                    amount=int(total * 100),
                    currency="usd",
                    metadata={"order_id": str(order.id), "user_email": user.email},
                )
                client_secret = intent.client_secret
                payment_intent_id = intent.id
            except stripe.error.StripeError:
                logger.exception("Stripe PaymentIntent creation failed for order %s", order.id)

        payment = Payment(
            order_id=order.id,
            stripe_payment_intent_id=payment_intent_id,
            amount=total,
            currency="usd",
            status=PaymentStatus.PENDING,
            method=PaymentMethod.STRIPE,
        )
        db.add(payment)
        db.commit()
        db.refresh(order)
        return order, client_secret

    # Offline bank transfer
    payment = Payment(
        order_id=order.id,
        amount=total,
        currency="usd",
        status=PaymentStatus.OFFLINE_PENDING,
        method=PaymentMethod.OFFLINE,
    )
    db.add(payment)
    db.commit()
    db.refresh(order)
    return order, None
