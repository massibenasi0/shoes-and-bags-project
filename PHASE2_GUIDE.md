# Phase 2 — Running Guide
## Commerce: Checkout, Payments, Orders & Email Notifications

---

## What works in Phase 2

| Feature | Status |
|---|---|
| Full shopping cart UI (edit qty, remove items) | ✅ |
| Multi-step checkout (shipping → payment) | ✅ |
| Stripe card payment (sandbox) | ✅ (needs Stripe keys) |
| Failed payment handling + error message | ✅ |
| Offline / bank transfer payment | ✅ |
| Order confirmation screen with bank details | ✅ |
| Order history page (`/orders`) | ✅ |
| Order detail page (`/orders/:id`) | ✅ |
| Email on order confirmation (Celery + RabbitMQ) | ✅ (needs SMTP config) |
| Email on payment status update | ✅ (needs SMTP config) |
| Admin: approve / reject offline payments via API | ✅ |
| Admin dashboard UI | ⏳ Phase 3 |
| User profile page | ⏳ Phase 3 |

---

## New prerequisites for Phase 2

Phase 2 adds **RabbitMQ** (message broker) and **Celery** (background worker).

### Option A — Run with Docker (recommended for Phase 2)

Docker handles everything (PostgreSQL, RabbitMQ, Celery worker, backend, frontend) in one command.

```bash
docker compose up --build
```

Then open http://localhost:3000

### Option B — Run locally without Docker

If you prefer running without Docker, you need RabbitMQ installed locally.

**Install RabbitMQ (Mac):**
```bash
brew install rabbitmq
brew services start rabbitmq
```

Verify it started:
```bash
brew services list | grep rabbitmq
# rabbitmq   started
```

---

## Configuration — backend `.env`

Create or update `backend/.env` with the following. Copy from `backend/.env.example` if it exists.

```env
# Required
DATABASE_URL=postgresql://shoesbags:shoesbags@localhost:5432/shoesbags
SECRET_KEY=your-long-random-secret-key

# Stripe (get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@localhost:5672//

# Email (optional — emails are skipped if not set)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

**Getting Stripe keys:**
1. Create a free account at https://stripe.com
2. Go to Developers → API keys
3. Copy the **Publishable key** (`pk_test_...`) and **Secret key** (`sk_test_...`)
4. Put the secret key in `backend/.env`
5. Put the publishable key in `frontend/.env` (create the file):
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

> If you skip Stripe keys, only the **offline bank transfer** option will appear in checkout. That still works fully.

---

## Starting Phase 2 locally (without Docker)

Open **three terminal tabs**.

### Tab 1 — Backend

```bash
cd /Users/macosmonterey/Desktop/projects/shoesbags/backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

### Tab 2 — Celery worker

```bash
cd /Users/macosmonterey/Desktop/projects/shoesbags/backend
source venv/bin/activate
celery -A app.worker.celery_app worker --loglevel=info -Q emails
```

You should see:
```
[tasks]
  . app.tasks.email_tasks.send_order_confirmation
  . app.tasks.email_tasks.send_payment_update

[2024-...] celery@... ready.
```

### Tab 3 — Frontend

```bash
cd /Users/macosmonterey/Desktop/projects/shoesbags/frontend
npm run dev
```

---

## Open the app

| URL | What it is |
|---|---|
| http://localhost:3000 | The app |
| http://localhost:8000/docs | API explorer (Swagger UI) |
| http://localhost:15672 | RabbitMQ management UI (guest / guest) |

---

## Test accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@shoesbags.com` | `admin123` |

Register a new customer at http://localhost:3000/register

---

## Things to try in Phase 2

### Complete a Stripe card purchase

1. Add items to the cart
2. Click **Proceed to Checkout** (must be logged in)
3. Fill in a shipping address (any values work)
4. Select **Pay with Card (Stripe)**
5. Enter the Stripe test card:
   - Card number: `4242 4242 4242 4242`
   - Expiry: any future date (e.g. `12/28`)
   - CVC: any 3 digits (e.g. `123`)
6. Click **Place Order**
7. You land on the confirmation screen with your Order ID
8. Go to **My Orders** in the header — your order appears with status **Confirmed**

**Test a declined card:**
Use `4000 0000 0000 0002` — payment will fail and an error message appears.

### Complete an offline bank transfer

1. Add items to the cart and go to checkout
2. Select **Bank Transfer (Offline)**
3. Click **Place Order**
4. The confirmation screen shows IBAN, BIC, reference number and amount
5. The order appears in **My Orders** with status **Pending**

### Approve an offline payment (as admin)

Via the API explorer at http://localhost:8000/docs:

1. Login as admin: `POST /api/auth/login`
2. Copy the `access_token` and click **Authorize**
3. Find the order ID from `GET /api/orders/` (log in as the customer first, or check the DB)
4. Call `POST /api/payments/offline/{order_id}/review` with:
   ```json
   { "action": "approve", "admin_notes": "Transfer verified" }
   ```
5. The order status changes to **Confirmed** and a payment update email is sent

---

## Async Queue — How it works

```
User places order
       │
       ▼
FastAPI backend
       │  creates Order + Payment in PostgreSQL
       │  calls Stripe PaymentIntent API (if Stripe)
       │
       ▼
Stripe confirms payment
       │  sends webhook to POST /api/payments/stripe/webhook
       ▼
Webhook handler
       │  marks Payment = COMPLETED, Order = CONFIRMED
       │  calls send_order_confirmation.delay(email, order_id, total)
       │                    │
       ▼                    ▼
  PostgreSQL           RabbitMQ queue ("emails")
                            │
                            ▼
                     Celery worker
                            │  picks up the task
                            ▼
                       SMTP server
                            │
                            ▼
                    Email delivered to user
```

The `.delay()` call publishes the task to RabbitMQ and returns immediately — the API response is not blocked by email sending. The Celery worker processes tasks independently in the background.

---

## Stripe webhook (local testing)

To test the full Stripe webhook flow locally, install the Stripe CLI:

```bash
brew install stripe/stripe-cli/stripe
stripe login
stripe listen --forward-to localhost:8000/api/payments/stripe/webhook
```

The CLI outputs a webhook signing secret — copy it to `STRIPE_WEBHOOK_SECRET` in `backend/.env`.

---

## Troubleshooting

### "Connection refused" to RabbitMQ
RabbitMQ is not running. Start it:
```bash
brew services start rabbitmq
```
Or use Docker: `docker compose up rabbitmq`

### Celery worker shows no tasks / crashes on import
Make sure the virtual environment is active in the Celery tab:
```bash
source /Users/macosmonterey/Desktop/projects/shoesbags/backend/venv/bin/activate
```

### Stripe payment fails immediately (not a card decline)
Check that `STRIPE_SECRET_KEY` in `backend/.env` starts with `sk_test_` and is valid.
Check backend logs for a Stripe error message.

### No email received after order
- Check that `SMTP_USER` and `SMTP_PASSWORD` are set in `backend/.env`
- If using Gmail, use an **App Password** (not your regular password): Google Account → Security → App passwords
- Check the Celery worker tab — you should see the task being processed
- Emails are skipped silently if SMTP is not configured (backend log will say "SMTP not configured")

### Order placed but status stays "pending" after Stripe payment
The Stripe webhook was not received. Either:
- Run `stripe listen --forward-to ...` (see above), or
- Manually mark the payment via `POST /api/payments/stripe/webhook` simulation in the Stripe dashboard

---

## Summary cheatsheet

```bash
# ── With Docker (easiest) ─────────────────────────────────────────
docker compose up --build
# Open → http://localhost:3000

# ── Without Docker (3 tabs) ──────────────────────────────────────
# Tab 1 — Backend
cd shoesbags/backend && source venv/bin/activate
uvicorn app.main:app --reload --port 8000

# Tab 2 — Celery worker
cd shoesbags/backend && source venv/bin/activate
celery -A app.worker.celery_app worker --loglevel=info -Q emails

# Tab 3 — Frontend
cd shoesbags/frontend && npm run dev
# Open → http://localhost:3000
```
