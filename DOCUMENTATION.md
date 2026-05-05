# ShoesBags — Project Documentation

**Student:** Mesroua Abderrahmen Massinissa,jaadi mohamed,sami dahmouni3
**University:** Kielce University of Technology
**Field:** Computer Science
**Project:** E-commerce web application — Shoes and Bags online store

---

## 1. What is this project

ShoesBags is an online store where users can browse shoes and bags, add them to a cart, and place orders. The project covers the full flow from browsing products to paying and receiving an email confirmation.

The project was built in two phases:
- **Phase 1** — product catalog, user registration, login, shopping cart
- **Phase 2** — checkout, payments, order history, email notifications

---

## 2. Technologies used

### Backend
- **Python 3.12** — main programming language
- **FastAPI** — web framework for building the REST API
- **SQLAlchemy** — ORM used to work with the database using Python classes instead of raw SQL
- **Alembic** — handles database migrations (creates and updates tables)
- **PostgreSQL** — the database where all data is stored
- **JWT (JSON Web Tokens)** — used for user authentication (login/logout)
- **Bcrypt** — used to hash and store passwords securely
- **Google OAuth2** — lets users log in with their Google account
- **Stripe** — handles card payments
- **Celery** — runs background tasks (sending emails)
- **RabbitMQ** — message queue, passes tasks from the backend to Celery
- **SMTP** — used to send emails (Gmail)

### Frontend
- **React 18** — JavaScript library for building the user interface
- **TypeScript** — adds types to JavaScript to catch errors early
- **Vite** — tool that runs and builds the frontend
- **Tailwind CSS** — CSS framework for styling
- **Redux Toolkit** — manages the global state (cart, user, orders)
- **React Router v6** — handles navigation between pages
- **Axios** — sends HTTP requests from the frontend to the backend
- **React Hook Form + Zod** — handles and validates forms
- **Stripe.js** — renders the card payment input in the browser
- **i18next** — supports two languages: English and Polish

---

## 3. Project structure

```
shoesbags/
├── backend/
│   ├── app/
│   │   ├── models/       # database tables (User, Product, Order, Payment...)
│   │   ├── routers/      # API endpoints (auth, products, orders, payments)
│   │   ├── schemas/      # request and response data structures
│   │   ├── services/     # business logic (create order, send email, Stripe)
│   │   ├── tasks/        # Celery background tasks (emails)
│   │   ├── core/         # security, JWT, dependencies
│   │   ├── config.py     # app settings loaded from .env
│   │   ├── database.py   # database connection
│   │   ├── main.py       # app entry point, registers all routers
│   │   ├── seed.py       # loads initial data into the database
│   │   └── worker.py     # Celery worker setup
│   ├── alembic/          # database migration files
│   └── requirements.txt  # Python dependencies
│
├── frontend/
│   └── src/
│       ├── api/          # functions that call the backend API
│       ├── components/   # reusable UI components (Button, Input, Header...)
│       ├── pages/        # one file per page (Home, Cart, Checkout, Orders...)
│       ├── store/        # Redux state slices
│       ├── i18n/         # translation files (en.json, pl.json)
│       ├── types/        # TypeScript type definitions
│       └── router/       # page routes and protected route logic
│
└── docker-compose.yml    # runs all services together with Docker
```

---

## 4. Database

The database has 5 tables:

| Table | What it stores |
|-------|---------------|
| `users` | registered accounts, passwords, roles |
| `categories` | shoes / bags |
| `products` | name, price, images, sizes, colors, stock |
| `orders` | order details, shipping address, items, status |
| `payments` | payment method, status, Stripe ID |

The connection to PostgreSQL is set up in `backend/app/database.py`.
Credentials are stored in `backend/.env`.

---

## 5. How authentication works

1. User registers → password is hashed with bcrypt and saved
2. User logs in → server checks the password and returns two JWT tokens:
   - **Access token** — used for API requests (expires in 30 min)
   - **Refresh token** — used to get a new access token (expires in 7 days)
3. Every protected request sends the access token in the Authorization header
4. Google OAuth2 is also supported — user clicks "Login with Google" and is redirected back with tokens

---

## 6. How payments work

### Stripe (card payment)
1. User fills in shipping address and selects card payment
2. Frontend calls the backend to create an order
3. Backend creates a Stripe PaymentIntent and returns a `client_secret`
4. Frontend uses the `client_secret` to confirm the card payment through Stripe
5. Stripe sends a webhook to the backend confirming the payment
6. Backend marks the order as confirmed and sends a confirmation email

### Offline (bank transfer)
1. User selects bank transfer at checkout
2. Order is created with status pending
3. Bank details (IBAN, reference) are shown on the confirmation screen
4. Admin reviews the transfer and approves or rejects it via the API

---

## 7. How emails work

Emails are sent in the background so the user does not have to wait:

1. Order is placed → backend sends a task to **RabbitMQ**
2. RabbitMQ holds the task in a queue
3. **Celery worker** picks it up and sends the email via SMTP
4. User receives an email with order details

Two types of emails are sent:
- Order confirmation (after successful payment)
- Payment status update (when admin approves or rejects a bank transfer)

---

## 8. Pages in the application

| Page | URL | Who can access |
|------|-----|----------------|
| Home | `/` | Everyone |
| Shoes | `/products?category=shoes` | Everyone |
| Bags | `/products?category=bags` | Everyone |
| Product detail | `/products/:id` | Everyone |
| Cart | `/cart` | Everyone |
| Login | `/login` | Everyone |
| Register | `/register` | Everyone |
| Checkout | `/checkout` | Logged in users |
| My Orders | `/orders` | Logged in users |
| Order detail | `/orders/:id` | Logged in users |
| Profile | `/profile` | Logged in users |
| Admin dashboard | `/admin` | Admin only |
| Contact | `/contact` | Everyone |

---

## 9. How to run the project

Make sure PostgreSQL and RabbitMQ are running, then open 3 terminals:

**Terminal 1 — Backend**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 — Celery worker**
```bash
cd backend
source venv/bin/activate
celery -A app.worker.celery_app worker --loglevel=info -Q emails
```

**Terminal 3 — Frontend**
```bash
cd frontend
npm run dev
```

Open the browser at `http://localhost:3000`

API documentation is available at `http://localhost:8000/docs`

---

## 10. Test accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@shoesbags.com | admin123 |

A regular customer account can be created at `/register`
