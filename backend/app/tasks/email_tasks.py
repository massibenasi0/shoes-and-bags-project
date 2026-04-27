from app.worker import celery_app
from app.services.email import send_email


@celery_app.task(name="app.tasks.email_tasks.send_order_confirmation")
def send_order_confirmation(to: str, order_id: str, total: float) -> None:
    subject = "Order Confirmed — ShoesBags"
    body = f"""
    <h2>Thank you for your order!</h2>
    <p>Your order has been placed successfully.</p>
    <p><strong>Order ID:</strong> {order_id}</p>
    <p><strong>Total:</strong> ${total:.2f}</p>
    <p>We'll notify you once your order ships.</p>
    <br><p>— The ShoesBags Team</p>
    """
    send_email(to, subject, body)


@celery_app.task(name="app.tasks.email_tasks.send_payment_update")
def send_payment_update(to: str, order_id: str, status: str) -> None:
    subject = "Payment Status Update — ShoesBags"
    body = f"""
    <h2>Payment Update</h2>
    <p>The payment status for your order has been updated.</p>
    <p><strong>Order ID:</strong> {order_id}</p>
    <p><strong>Payment Status:</strong> {status.replace('_', ' ').title()}</p>
    <br><p>— The ShoesBags Team</p>
    """
    send_email(to, subject, body)
