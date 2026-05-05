# Phase 2 — Short Summary

## What was added

**Checkout**
- 2-step checkout: shipping address → payment method
- Stripe card payment (sandbox) with real-time error handling
- Offline bank transfer option with IBAN details on confirmation screen

**Orders**
- Order history page (`/orders`) with status badges
- Order detail page (`/orders/:id`) with items and shipping info
- "My Orders" link in the navigation for logged-in users

**Emails (async)**
- Order confirmation email sent automatically after payment
- Payment status update email when admin approves/rejects a bank transfer
- Emails run in the background via Celery + RabbitMQ (non-blocking)

**Product updates**
- Real photos added to all 10 products (Unsplash)
- Shoe sizes standardised to 36 → 41
- Shoes and bags now show separately when clicking the nav links

---

## New API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders/` | Place an order |
| GET | `/api/orders/` | List my orders |
| GET | `/api/orders/{id}` | Order detail |
| POST | `/api/payments/stripe/webhook` | Stripe webhook |
| POST | `/api/payments/offline/{id}/review` | Admin approve/reject |

---

## Tech added in Phase 2

| What | Technology |
|------|-----------|
| Card payments | Stripe |
| Background tasks | Celery 5 |
| Message broker | RabbitMQ |
| Emails | SMTP (Gmail) |

---

## Test card (Stripe sandbox)

| Card | Result |
|------|--------|
| `4242 4242 4242 4242` | Payment succeeds |
| `4000 0000 0000 0002` | Payment declined |

Expiry: any future date — CVC: any 3 digits
