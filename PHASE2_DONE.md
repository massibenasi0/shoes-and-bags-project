# ShoesBags — Phase 2 Complete

E-commerce platform for shoes and bags. Built with FastAPI (Python) + React + PostgreSQL.

---

## Technical Requirements Status

| Requirement | Status | Notes |
|-------------|--------|-------|
| REST API pattern | ✅ Done | FastAPI backend exposing a full REST API |
| Backend not JS/Node/TS | ✅ Done | Backend is Python 3.12 with FastAPI |
| OAuth2 Social Media login | ✅ Done | Google OAuth2 implemented (backend + frontend) |
| Electronic payment (Stripe) | ✅ Done | Stripe sandbox card payments in checkout |
| Failed payment handling | ✅ Done | Stripe webhook marks failed payments; error shown to user |
| Offline payment approval (admin) | ✅ Done | Admin can approve/reject bank transfer payments via API |
| Async message queues (RabbitMQ) | ✅ Done | Celery + RabbitMQ send order confirmation and payment update emails |
| Automated tests (≥50% coverage) | 🔄 Phase 3 | pytest (backend) + Jest (frontend) |

---

## What was built in Phase 2

### Backend

**New routers:**
- `POST /api/orders/` — place an order (Stripe or offline), returns `client_secret` for Stripe
- `GET /api/orders/` — list the current user's orders (newest first)
- `GET /api/orders/{id}` — get a single order by ID
- `POST /api/payments/stripe/webhook` — Stripe webhook (marks payment completed/failed, triggers email)
- `GET /api/payments/order/{order_id}` — get payment record for an order
- `POST /api/payments/offline/{order_id}/review` — admin approves or rejects a bank transfer

**New services:**
- `app/services/order.py` — creates Order + Payment records, calls Stripe PaymentIntent API
- `app/services/payment.py` — processes Stripe webhooks, updates order/payment status
- `app/services/email.py` — SMTP email sender (gracefully skips if SMTP is not configured)

**Async email queue:**
- `app/worker.py` — Celery application connected to RabbitMQ
- `app/tasks/email_tasks.py` — `send_order_confirmation` and `send_payment_update` tasks

**Infrastructure:**
- `docker-compose.yml` updated to include `rabbitmq` and `celery_worker` services

### Frontend

**New pages:**
- `/checkout` — multi-step checkout: shipping address form → payment selection (Stripe card or offline bank transfer) → order confirmation screen
- `/orders` — order history list with status badges and item previews
- `/orders/:id` — order detail: items, shipping address, total, status

**New state:**
- `src/store/orderSlice.ts` — Redux slice for fetching and storing orders
- `src/api/orders.ts` + `src/api/payments.ts` — typed API clients

**UI updates:**
- "My Orders" link added to the header for logged-in users
- Checkout page shows order summary sidebar alongside the form
- Stripe test card instructions shown in the card payment option
- Bank transfer details (IBAN, reference, amount) shown on the confirmation screen for offline orders
- Full EN/PL translations for all new screens

---

## Documentation

| Item | Status | Notes |
|------|--------|-------|
| Project objective & functionalities | ✅ Done | This document + PHASES.md |
| Database schema (ERD) | ✅ Done | Models: User, Product, Category, Order, Payment |
| API documentation (Swagger) | ✅ Done | Auto-generated at `http://localhost:8000/docs` |
| Async mechanisms description | ✅ Done | See PHASE2_GUIDE.md → Async Queue section |
| Use Case Diagram (UML) | 🔄 Phase 3 | To be added to final report |
| Class / Architecture Diagram | 🔄 Phase 3 | To be added to final report |
| Test report | 🔄 Phase 3 | After test suites are written |
| Installation manual | ✅ Done | See PHASE2_GUIDE.md |

---

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.12, FastAPI, SQLAlchemy, Alembic |
| Database | PostgreSQL |
| Auth | JWT (python-jose), bcrypt, Google OAuth2 |
| Payments | Stripe (card) + offline bank transfer |
| Async queues | Celery 5 + RabbitMQ 3.13 |
| Email | SMTP (Gmail or any provider) |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| State | Redux Toolkit |
| i18n | i18next (EN / PL) |
| Tests | pytest + Jest (Phase 3) |
