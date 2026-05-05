from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.dependencies import get_admin_user
from app.database import get_db
from app.models.order import Order, OrderStatus
from app.models.payment import Payment, PaymentStatus
from app.models.product import Product
from app.models.user import User
from app.schemas.order import OrderStatusUpdate
from app.schemas.product import ProductResponse

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/stats")
def get_stats(db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    total_orders = db.query(Order).count()
    total_revenue = (
        db.query(func.sum(Order.total_amount))
        .filter(Order.status != OrderStatus.CANCELLED)
        .scalar() or 0
    )
    pending_payments = (
        db.query(Payment)
        .filter(Payment.status == PaymentStatus.OFFLINE_PENDING)
        .count()
    )
    total_products = db.query(Product).filter(Product.is_active == True).count()  # noqa: E712
    return {
        "total_orders": total_orders,
        "total_revenue": float(total_revenue),
        "pending_payments": pending_payments,
        "total_products": total_products,
    }


@router.get("/orders")
def get_all_orders(db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    return [
        {
            "id": str(o.id),
            "user_email": o.user.email,
            "user_name": o.user.full_name,
            "status": o.status,
            "total_amount": float(o.total_amount),
            "items_count": len(o.items),
            "created_at": o.created_at.isoformat() if o.created_at else None,
        }
        for o in orders
    ]


@router.put("/orders/{order_id}/status")
def update_order_status(
    order_id: UUID,
    body: OrderStatusUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_admin_user),
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = body.status
    db.commit()
    return {"message": "Status updated"}


@router.get("/payments")
def get_all_payments(db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    payments = db.query(Payment).order_by(Payment.created_at.desc()).all()
    return [
        {
            "id": str(p.id),
            "order_id": str(p.order_id),
            "user_email": p.order.user.email,
            "amount": float(p.amount),
            "method": p.method,
            "status": p.status,
            "admin_notes": p.admin_notes,
            "created_at": p.created_at.isoformat() if p.created_at else None,
        }
        for p in payments
    ]


@router.get("/products", response_model=list[ProductResponse])
def get_all_products(db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    return db.query(Product).order_by(Product.created_at.desc()).all()
