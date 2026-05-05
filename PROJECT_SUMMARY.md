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
