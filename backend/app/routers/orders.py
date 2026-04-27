from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database import get_db
from app.models.order import Order
from app.models.user import User
from app.schemas.order import OrderCreate, OrderResponse
from app.services.order import create_order

router = APIRouter(prefix="/api/orders", tags=["orders"])


@router.post("/", status_code=status.HTTP_201_CREATED)
def place_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if not order_data.items:
        raise HTTPException(status_code=400, detail="Order must have at least one item")
    try:
        order, client_secret = create_order(db, order_data, user)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    response: dict = {
        "order_id": str(order.id),
        "total_amount": float(order.total_amount),
        "status": order.status,
        "payment_method": order_data.payment_method,
    }
    if client_secret:
        response["client_secret"] = client_secret
    return response


@router.get("/", response_model=List[OrderResponse])
def list_my_orders(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return (
        db.query(Order)
        .filter(Order.user_id == user.id)
        .order_by(Order.created_at.desc())
        .all()
    )


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: UUID,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id, Order.user_id == user.id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
