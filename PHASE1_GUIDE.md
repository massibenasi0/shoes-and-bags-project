# Phase 1 — Running Guide
## Foundation: Auth, Product Catalog & Core UI

---

## What works in Phase 1

| Feature | Status |
|---|---|
| Browse home page with featured products | ✅ |
| Filter / sort / paginate product catalog | ✅ |
| View product detail (size, color, images) | ✅ |
| Add products to cart (saved in browser) | ✅ |
| Register with email + password | ✅ |
| Login with email + password | ✅ |
| Google OAuth2 login | ✅ (needs Google credentials) |
| Switch language EN ↔ ES | ✅ |
| Dark / Light theme toggle | ✅ |
| Admin: manage products via API | ✅ |
| Checkout / Payments | ⏳ Phase 2 |
| Order history | ⏳ Phase 2 |
| Admin dashboard UI | ⏳ Phase 3 |

---

## Prerequisites

Make sure these are installed:

```bash
python3.12 --version   # must be 3.12.x
node --version         # must be 20+
psql --version         # PostgreSQL 15+
brew services list     # PostgreSQL should be running
```

If Python 3.12 is not installed:
```bash
brew install python@3.12
```

If PostgreSQL is not installed:
```bash
brew install postgresql@16
brew services start postgresql@16
```

---

## First-time setup (run once)

### 1 — Create the database

```bash
/opt/homebrew/opt/postgresql@16/bin/psql postgres -c "CREATE USER shoesbags WITH PASSWORD 'shoesbags';"
/opt/homebrew/opt/postgresql@16/bin/psql postgres -c "CREATE DATABASE shoesbags OWNER shoesbags;"
```

> Skip this step if you already ran it before.

### 2 — Configure the backend

```bash
cd /Users/macosmonterey/Desktop/projects/shoesbags/backend
cp .env.example .env
```

Open `backend/.env` and set a real `SECRET_KEY`:
```env
SECRET_KEY=any-long-random-string-at-least-32-characters
```

Generate one automatically:
```bash
python3.12 -c "import secrets; print(secrets.token_hex(32))"
```
Copy the output and paste it as the `SECRET_KEY` value.

### 3 — Install backend dependencies

```bash
cd /Users/macosmonterey/Desktop/projects/shoesbags/backend
python3.12 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### 4 — Create tables and load sample data

```bash
alembic upgrade head
python -m app.seed
```

Expected output:
```
Seed data inserted successfully!
  Admin: admin@shoesbags.com / admin123
```

### 5 — Install frontend dependencies

```bash
cd /Users/macosmonterey/Desktop/projects/shoesbags/frontend
npm install
```

---

## Every time you want to start

Open **two terminal tabs** side by side.

### Tab 1 — Backend

```bash
cd /Users/macosmonterey/Desktop/projects/shoesbags/backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
```

### Tab 2 — Frontend

```bash
cd /Users/macosmonterey/Desktop/projects/shoesbags/frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

---

## Open the app

| URL | What it is |
|---|---|
| http://localhost:3000 | The app |
| http://localhost:8000/docs | API explorer (Swagger UI) |
| http://localhost:8000/api/health | Quick health check |

---

## Test accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@shoesbags.com` | `admin123` |

You can also register a new customer account directly from the app at http://localhost:3000/register

---

## Things to try in Phase 1

### As a visitor
1. Go to http://localhost:3000 — see the hero section and featured products
2. Click **Shop Shoes** or **Shop Bags** to browse the catalog
3. Use the search bar, price filter, and sort dropdown
4. Click any product to see its detail page
5. Select a size and color, then click **Add to Cart**
6. Go to the cart (icon in the header) — items are there even after refresh
7. Toggle the **sun/moon icon** in the header to switch dark/light mode
8. Toggle **EN/ES** to switch language

### As a customer
1. Go to http://localhost:3000/register and create an account
2. Log in at http://localhost:3000/login
3. Your name appears in the header
4. Add products to cart — cart is preserved across sessions

### As an admin (via API)
The admin dashboard UI is built in Phase 3, but you can manage products right now through the API explorer:

1. Open http://localhost:8000/docs
2. Use **POST /api/auth/login** with `admin@shoesbags.com` / `admin123`
3. Copy the `access_token` from the response
4. Click **Authorize** (top right), paste the token
5. Now you can:
   - `POST /api/products` — create a product
   - `PUT /api/products/{id}` — edit a product
   - `DELETE /api/products/{id}` — soft-delete a product
   - `POST /api/categories` — add a category

---

## Stop the project

In each terminal tab press:
```
Ctrl + C
```

PostgreSQL keeps running in the background (data is preserved). Next time just run the two start commands above.

---

## Troubleshooting

### "command not found: alembic" or "command not found: uvicorn"
The virtual environment is not active. Run:
```bash
source /Users/macosmonterey/Desktop/projects/shoesbags/backend/venv/bin/activate
```

### "connection refused" / cannot connect to database
PostgreSQL is not running. Start it:
```bash
brew services start postgresql@16
```

### Frontend shows blank page or "Network Error"
The backend is not running. Start Tab 1 first, then Tab 2.

### "relation does not exist" error from backend
Migrations were not run. Run:
```bash
cd /Users/macosmonterey/Desktop/projects/shoesbags/backend
source venv/bin/activate
alembic upgrade head
```

### Products don't appear on the home page
Seed data was not loaded. Run:
```bash
cd /Users/macosmonterey/Desktop/projects/shoesbags/backend
source venv/bin/activate
python -m app.seed
```

### pip install failed (pydantic-core / psycopg2 errors)
You are using Python 3.13. Delete the venv and recreate with 3.12:
```bash
cd /Users/macosmonterey/Desktop/projects/shoesbags/backend
rm -rf venv
python3.12 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

---

## Summary cheatsheet

```bash
# ── First time only ──────────────────────────────────────────────
brew install python@3.12 postgresql@16
brew services start postgresql@16
/opt/homebrew/opt/postgresql@16/bin/psql postgres -c "CREATE USER shoesbags WITH PASSWORD 'shoesbags';"
/opt/homebrew/opt/postgresql@16/bin/psql postgres -c "CREATE DATABASE shoesbags OWNER shoesbags;"

cd backend && python3.12 -m venv venv && source venv/bin/activate
pip install --upgrade pip && pip install -r requirements.txt
alembic upgrade head && python -m app.seed

cd ../frontend && npm install

# ── Every time ───────────────────────────────────────────────────
# Tab 1 (backend)
cd shoesbags/backend && source venv/bin/activate
uvicorn app.main:app --reload --port 8000

# Tab 2 (frontend)
cd shoesbags/frontend
npm run dev

# Then open → http://localhost:3000
```
