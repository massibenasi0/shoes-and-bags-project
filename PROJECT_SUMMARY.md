# ShoesBags — Project Summary

**Students:** Mesroua Abderrahmen Massinissa, Jaadi Mohamed, Sami Dahmouni
**University:** Kielce University of Technology
**Field:** Computer Science

---

## What is this project

ShoesBags is a full-stack e-commerce website for buying shoes and bags online. Users can browse products, add them to a cart, place orders and pay by card or bank transfer. Admins can manage products, orders and payments from a dashboard.

---

## Tech Stack

**Backend:** Python, FastAPI, PostgreSQL, SQLAlchemy, JWT, Stripe, Celery, RabbitMQ

**Frontend:** React, TypeScript, Tailwind CSS, Redux, Stripe.js

**Other:** Docker, GitHub Actions (CI/CD), pytest, Jest

---

## Features

- Browse shoes and bags separately
- Register and log in (email or Google)
- Add to cart, checkout with card or bank transfer
- Order history and order detail pages
- Email notifications after payment
- Admin dashboard — manage products, orders, payments
- User profile with editable name
- Dark/light theme and English/Polish language switch
- Automated tests and CI/CD on GitHub

---

## Requirements completed per phase

### Phase 1 — Foundation

| Requirement | Status |
|-------------|--------|
| REST API (FastAPI backend) | Done |
| Backend in Python (not JS/Node) | Done |
| User registration and login with JWT | Done |
| Google OAuth2 social login | Done |
| Product catalog with filters, search and pagination | Done |
| Shopping cart saved in browser | Done |
| Dark/Light theme toggle | Done |
| English/Polish language switch | Done |
| Database with 5 tables (users, products, categories, orders, payments) | Done |
| Database migrations with Alembic | Done |
| Auto-generated API documentation (Swagger) | Done |
| Seeded database with 10 products and admin account | Done |

---

### Phase 2 — Commerce

| Requirement | Status |
|-------------|--------|
| Electronic payment with Stripe (card, sandbox) | Done |
| Failed payment handling (Stripe webhook) | Done |
| Offline payment (bank transfer) option | Done |
| Admin can approve or reject offline payments | Done |
| Async message queue with RabbitMQ | Done |
| Background email sending with Celery | Done |
| Order confirmation email after payment | Done |
| Payment status update email | Done |
| Full checkout flow (shipping → payment → confirmation) | Done |
| Order history page | Done |
| Order detail page | Done |

---

### Phase 3 — Admin & Polish

| Requirement | Status |
|-------------|--------|
| Admin dashboard with stats | Done |
| Admin can add, edit and delete products | Done |
| Admin can update order status | Done |
| Admin can approve/reject offline payments from UI | Done |
| User profile page with editable name | Done |
| Backend automated tests with pytest (≥50% coverage) | Done |
| Frontend automated tests with Jest (≥30% coverage) | Done |
| CI/CD with GitHub Actions (runs on every push) | Done |

---

## Project was built in 3 phases

| Phase | What was built |
|-------|---------------|
| Phase 1 | Product catalog, authentication, shopping cart |
| Phase 2 | Checkout, Stripe payments, orders, email notifications |
| Phase 3 | Admin dashboard, user profile, tests, CI/CD |

---

## How to run

```bash
cd shoesbags
docker compose up --build
```

Open **http://localhost:3000**

**Admin account:** admin@shoesbags.com / massi
