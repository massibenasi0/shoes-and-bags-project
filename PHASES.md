 # ShoesBags — Project Phases

E-commerce platform for shoes and bags built with FastAPI (Python) + React + PostgreSQL.

---

## Phase 1 — Foundation ✅ Done

**Goal:** Users can browse products, register, log in, and add items to the cart.

### What was built
- **Database:** All models created — User, Product, Category, Order, Payment
- **Authentication:** Register, login, logout with JWT tokens + Google OAuth2 login
- **Products API:** List, filter by category/brand/price, search, sort, pagination
- **Frontend pages:** Home, Product List, Product Detail, Login, Register, 404
- **Shopping cart:** Add/remove/update items, quantity badge in header (saved in browser)
- **UI features:** Dark/Light theme toggle, English/Polish language toggle
- **Navigation:** Responsive header with mobile menu, footer with links
- **Contact Us page:** Two team contacts with name, phone, email, LinkedIn and opening hours
- **Database seed:** 10 products (5 shoes + 5 bags) + admin account pre-loaded
- **API docs:** Auto-generated Swagger UI at `http://localhost:8000/docs`

---

## Phase 2 — Commerce ✅ Done

**Goal:** Complete the full buying flow from cart to confirmed order with payments.

### What was built
- **Cart page:** Full UI with quantity editing and item removal
- **Checkout:** Multi-step form — shipping address → payment method → confirmation
- **Stripe payments:** Pay with card (sandbox), handles failed payments via webhook
- **Offline payment:** Bank transfer option, admin approves or rejects via API
- **Orders:** Create order, view order history (`/orders`), order detail page (`/orders/:id`)
- **Email notifications:** Automatic email on order confirmation and payment status update
- **Async queues:** Celery + RabbitMQ for background email sending
- **Docker:** Updated `docker-compose.yml` with RabbitMQ + Celery worker services

---

## Phase 3 — Admin & Polish ✅ Done

**Goal:** Full admin dashboard, automated tests, and production-ready setup.

### What was built
- **Admin dashboard:** Stats bar + tabs for Products (add/edit/delete), Orders (status update), Payments (approve/reject offline)
- **User profile page:** View name/email/role, edit name inline, see recent orders
- **Profile update API:** `PUT /api/auth/me` — update full name
- **Admin API:** `/api/admin/stats`, `/api/admin/orders`, `/api/admin/payments`, `/api/admin/products`
- **Automated tests:** Backend pytest (orders + admin) + Frontend Jest (orderSlice)
- **CI/CD:** GitHub Actions runs backend + frontend tests on every push to main

---

## Admin Account (seeded)

| Field | Value |
|-------|-------|
| Email | admin@shoesbags.com |
| Password | admin123 |
data base 
We used SQLAlchemy as the ORM (Object Relational Mapper) to connect to 
  ▎ PostgreSQL. The connection string is stored in a .env file and loaded via   
  ▎ pydantic-settings. Each API request gets its own database session through a 
  ▎ FastAPI dependency injection, and the database tables are managed with      
  ▎ Alembic for migrations.
RabbitMQ as the message broker. 
backend/app/config.py
