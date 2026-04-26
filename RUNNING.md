# ShoesBags — How to Run the Project

This guide covers every way to run the project: Docker (recommended), and full local development without Docker.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Environment Setup](#2-environment-setup)
3. [Option A — Docker (Recommended)](#3-option-a--docker-recommended)
4. [Option B — Local Development (No Docker)](#4-option-b--local-development-no-docker)
5. [Running Tests](#5-running-tests)
6. [Environment Variables Reference](#6-environment-variables-reference)
7. [Useful URLs](#7-useful-urls)
8. [Common Problems & Fixes](#8-common-problems--fixes)

---

## 1. Prerequisites

Make sure the following are installed before you start.

### For Docker (Option A)
| Tool | Min Version | Check |
|---|---|---|
| Docker Desktop | 24+ | `docker --version` |
| Docker Compose | v2 | `docker compose version` |

### For local development (Option B)
| Tool | Min Version | Check |
|---|---|---|
| Python | 3.12+ | `python3 --version` |
| Node.js | 20+ | `node --version` |
| npm | 10+ | `npm --version` |
| PostgreSQL | 15+ | `psql --version` |

> **Note:** For Phase 2 and beyond you will also need RabbitMQ running locally. Docker handles this automatically.

---

## 2. Environment Setup

Both the backend and frontend need their own `.env` file. These are created by copying the examples:

```bash
# From the project root (shoesbags/)
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Minimum required changes in `backend/.env`

Open `backend/.env` and change at least these two values:

```env
# Generate a strong random key — REQUIRED
SECRET_KEY=replace-this-with-a-long-random-string-at-least-32-chars

# Your local or Docker PostgreSQL connection
DATABASE_URL=postgresql://shoesbags:shoesbags@localhost:5432/shoesbags
```

To generate a secure SECRET_KEY run:
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

### Optional credentials (needed for full features)

| Feature | Variable(s) needed | Where to get them |
|---|---|---|
| Google login | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| Stripe payments | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | [Stripe Dashboard → Test keys](https://dashboard.stripe.com/test/apikeys) |
| Email sending | `SMTP_USER`, `SMTP_PASSWORD` | Gmail App Password |

> These are optional for Phase 1. The app runs without them — just skip any feature that needs them.

---

## 3. Option A — Docker (Recommended)

This is the easiest way. One command starts the database, the backend, and the frontend.

### Step 1 — Copy env files

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit `backend/.env` and set a real `SECRET_KEY` (see above).

### Step 2 — Build and start

```bash
docker compose up --build
```

On the first run Docker will:
1. Pull the PostgreSQL 16 image
2. Build the Python backend image
3. Build the Node.js frontend image
4. Start all three services
5. Run `alembic upgrade head` (creates all tables)
6. Run the seed script (creates admin user + 10 products)
7. Start the backend on port 8000
8. Start the frontend dev server on port 3000

> First build takes ~2-3 minutes. Subsequent starts are fast.

### Step 3 — Open the app

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API docs | http://localhost:8000/docs |
| Backend health | http://localhost:8000/api/health |

### Stopping

```bash
# Stop all containers (keeps data)
docker compose down

# Stop and wipe the database volume (fresh start)
docker compose down -v
```

### Re-seeding the database

```bash
docker compose exec backend python -m app.seed
```

### Viewing logs

```bash
# All services
docker compose logs -f

# Backend only
docker compose logs -f backend

# Frontend only
docker compose logs -f frontend
```

---

## 4. Option B — Local Development (No Docker)

Run each service directly on your machine. Requires PostgreSQL installed locally.

### Step 1 — Create the PostgreSQL database

```bash
# Connect to postgres
psql -U postgres

# Inside psql, run:
CREATE USER shoesbags WITH PASSWORD 'shoesbags';
CREATE DATABASE shoesbags OWNER shoesbags;
CREATE DATABASE shoesbags_test OWNER shoesbags;   -- for tests
\q
```

### Step 2 — Backend setup

```bash
cd backend

# Create a virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate          # macOS / Linux
# venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Copy and configure env
cp .env.example .env
# Open .env and set DATABASE_URL + SECRET_KEY
```

Run database migrations:
```bash
alembic upgrade head
```

Seed the database with sample data:
```bash
python -m app.seed
```

Expected output:
```
Seed data inserted successfully!
  Admin: admin@shoesbags.com / admin123
```

Start the backend:
```bash
uvicorn app.main:app --reload --port 8000
```

The API is now live at http://localhost:8000  
Interactive docs at http://localhost:8000/docs

### Step 3 — Frontend setup

Open a **new terminal tab**:

```bash
cd frontend

# Install dependencies
npm install

# Copy env
cp .env.example .env
# Open .env and verify VITE_API_URL=http://localhost:8000
```

Start the dev server:
```bash
npm run dev
```

The frontend is now live at http://localhost:3000

### Step 4 (Phase 2+) — Start Celery worker

If you are running Phase 2 or later and want background jobs (emails, payment notifications), you need RabbitMQ running and a Celery worker.

**Start RabbitMQ** (easiest via Docker even in local mode):
```bash
docker run -d --name rabbitmq \
  -p 5672:5672 -p 15672:15672 \
  rabbitmq:3.13-management-alpine
```

**Start Celery worker** (in a third terminal, inside `backend/` with venv activated):
```bash
celery -A app.tasks.celery_app worker --loglevel=info
```

---

## 5. Running Tests

### Backend tests

```bash
cd backend
source venv/bin/activate      # if not already active

# Needs shoesbags_test database (created in step above)
# Make sure DATABASE_URL points to the test DB, or tests override it via conftest.py

# Run all tests
pytest -v

# Run with coverage report
pytest --cov=app --cov-report=term-missing -v

# Run a specific file
pytest tests/test_auth.py -v
pytest tests/test_products.py -v
```

Expected output example:
```
tests/test_auth.py::test_register PASSED
tests/test_auth.py::test_login_success PASSED
tests/test_products.py::test_list_products PASSED
...
---------- coverage: 52% ----------
```

### Frontend tests

```bash
cd frontend

# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Run in watch mode (re-runs on file change)
npm test -- --watch
```

Expected output example:
```
PASS src/__tests__/store/cartSlice.test.ts
PASS src/__tests__/components/ProductCard.test.tsx
PASS src/__tests__/components/LoginForm.test.tsx
...
Test Suites: 5 passed, 5 total
```

---

## 6. Environment Variables Reference

### `backend/.env`

| Variable | Default | Required | Description |
|---|---|---|---|
| `DATABASE_URL` | — | Yes | PostgreSQL connection string |
| `SECRET_KEY` | — | Yes | JWT signing key (min 32 chars) |
| `ALGORITHM` | `HS256` | No | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | No | Access token lifetime |
| `REFRESH_TOKEN_EXPIRE_DAYS` | `7` | No | Refresh token lifetime |
| `GOOGLE_CLIENT_ID` | — | Phase 1+ (optional) | For Google OAuth2 login |
| `GOOGLE_CLIENT_SECRET` | — | Phase 1+ (optional) | For Google OAuth2 login |
| `GOOGLE_REDIRECT_URI` | `http://localhost:8000/api/auth/google/callback` | No | Must match Google Console |
| `STRIPE_SECRET_KEY` | — | Phase 2+ | Stripe secret key (use `sk_test_...` for sandbox) |
| `STRIPE_WEBHOOK_SECRET` | — | Phase 2+ | From Stripe CLI or dashboard |
| `RABBITMQ_URL` | `amqp://guest:guest@localhost:5672//` | Phase 2+ | RabbitMQ broker URL |
| `SMTP_HOST` | `smtp.gmail.com` | Phase 2+ | Email server host |
| `SMTP_PORT` | `587` | Phase 2+ | Email server port |
| `SMTP_USER` | — | Phase 2+ | Email address |
| `SMTP_PASSWORD` | — | Phase 2+ | Email app password |
| `FRONTEND_URL` | `http://localhost:3000` | No | Used in Google OAuth redirect |
| `CORS_ORIGINS` | `http://localhost:3000,...` | No | Comma-separated allowed origins |

### `frontend/.env`

| Variable | Default | Required | Description |
|---|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | Yes | Backend base URL |
| `VITE_STRIPE_PUBLISHABLE_KEY` | — | Phase 2+ | Stripe publishable key (`pk_test_...`) |
| `VITE_GOOGLE_CLIENT_ID` | — | Phase 1+ (optional) | Google OAuth2 client ID |

---

## 7. Useful URLs

| URL | Description |
|---|---|
| http://localhost:3000 | Frontend app |
| http://localhost:8000/docs | Swagger UI (interactive API docs) |
| http://localhost:8000/redoc | ReDoc API docs |
| http://localhost:8000/api/health | Health check endpoint |
| http://localhost:15672 | RabbitMQ management UI (Phase 2+) |

### Default accounts (seeded)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@shoesbags.com` | `admin123` |

---

## 8. Common Problems & Fixes

### `alembic upgrade head` fails — "database does not exist"

The database user or database was not created. Run the PostgreSQL setup in [Step 1 of Option B](#step-1--create-the-postgresql-database).

---

### Backend starts but returns 500 on every request

Check that your `DATABASE_URL` in `.env` is correct and PostgreSQL is running:
```bash
psql postgresql://shoesbags:shoesbags@localhost:5432/shoesbags -c "SELECT 1;"
```

---

### Frontend shows "Network Error" / API calls fail

The frontend cannot reach the backend. Check:
1. Backend is running on port 8000
2. `VITE_API_URL=http://localhost:8000` in `frontend/.env`
3. CORS: `CORS_ORIGINS` in `backend/.env` includes `http://localhost:3000`

---

### `npm run dev` fails with "Cannot find module"

Dependencies were not installed:
```bash
cd frontend && npm install
```

---

### Docker: `port is already allocated`

Something else is using port 3000 or 8000. Either stop the conflicting process or change the ports in `docker-compose.yml`:
```yaml
ports:
  - "8080:8000"   # backend on 8080 instead
```
Then update `VITE_API_URL=http://localhost:8080` in `frontend/.env`.

---

### Docker: backend exits with "Connection refused" to DB

The database container takes a few seconds to be ready. The compose file has a `healthcheck` that waits, but if it still fails, increase the retry count in `docker-compose.yml`:
```yaml
healthcheck:
  retries: 20   # increase from 10
```

---

### Alembic says "Target database is not up to date"

Run migrations first:
```bash
# Local
cd backend && alembic upgrade head

# Docker
docker compose exec backend alembic upgrade head
```

---

### Tests fail with "could not connect to server"

The test database `shoesbags_test` does not exist. Create it:
```bash
psql -U postgres -c "CREATE DATABASE shoesbags_test OWNER shoesbags;"
```

---

### Google login redirects to an error page

1. Confirm `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set correctly.
2. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials), add `http://localhost:8000/api/auth/google/callback` to **Authorized redirect URIs**.
3. Add `http://localhost:3000` to **Authorized JavaScript origins**.

---

### Stripe payments fail with "No API key provided"

Set `STRIPE_SECRET_KEY` in `backend/.env` using your test key from the Stripe dashboard (`sk_test_...`).  
Set `VITE_STRIPE_PUBLISHABLE_KEY` in `frontend/.env` using your test publishable key (`pk_test_...`).

> Always use test keys (prefix `sk_test_` / `pk_test_`) during development. Never commit real keys.

---

## Quick Reference

```bash
# ── Docker (easiest) ─────────────────────────────────────────────
cp backend/.env.example backend/.env    # then set SECRET_KEY
cp frontend/.env.example frontend/.env
docker compose up --build               # first run
docker compose up                       # subsequent runs
docker compose down                     # stop
docker compose down -v                  # stop + wipe DB

# ── Local backend ────────────────────────────────────────────────
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
python -m app.seed
uvicorn app.main:app --reload --port 8000

# ── Local frontend ───────────────────────────────────────────────
cd frontend
npm install
npm run dev

# ── Tests ────────────────────────────────────────────────────────
cd backend && pytest --cov=app -v
cd frontend && npm run test:coverage
```
