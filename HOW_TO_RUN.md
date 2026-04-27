# How to Run ShoesBags

## Quick start (Phase 2 — with Docker)

```bash
docker compose up --build
```

Then open http://localhost:3000

---

## Every time you want to start (without Docker)

Phase 2 needs **three** terminal tabs (backend + Celery worker + frontend).

### Step 1 — Make sure RabbitMQ is running
```bash
brew services start rabbitmq
```

### Step 2 — Open Terminal 1 (Backend)
```bash
cd /Users/macosmonterey/Desktop/projects/shoesbags/backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

Wait until you see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

### Step 3 — Open Terminal 2 (Celery worker)
```bash
cd /Users/macosmonterey/Desktop/projects/shoesbags/backend
source venv/bin/activate
celery -A app.worker.celery_app worker --loglevel=info -Q emails
```

Wait until you see:
```
[tasks]
  . app.tasks.email_tasks.send_order_confirmation
  . app.tasks.email_tasks.send_payment_update
celery@... ready.
```

### Step 4 — Open Terminal 3 (Frontend)
```bash
cd /Users/macosmonterey/Desktop/projects/shoesbags/frontend
npm run dev
```

Wait until you see:
```
➜  Local:   http://localhost:3000/
```

### Step 5 — Open the website
```
http://localhost:3000
```

---

## Login credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@shoesbags.com | admin123 |

---

## Useful URLs

| URL | What it is |
|---|---|
| http://localhost:3000 | The app |
| http://localhost:8000/docs | API explorer (Swagger UI) |
| http://localhost:15672 | RabbitMQ management UI (guest / guest) |

---

## Stripe test card

Use this card number in checkout to simulate a successful payment:
```
4242 4242 4242 4242   Expiry: 12/28   CVC: 123
```

Use `4000 0000 0000 0002` to test a card decline.

---

## To stop the project

Press **Ctrl+C** in each terminal tab.

---

## If PostgreSQL is not running (after a Mac reboot)
```bash
brew services start postgresql@16
```

---

## Important rules
- Both RabbitMQ and PostgreSQL must be running before starting the backend
- Open Terminal 1 (backend) first, then Terminal 2 (Celery), then Terminal 3 (frontend)
- See `PHASE2_GUIDE.md` for full setup instructions and troubleshooting
