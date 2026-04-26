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

## Phase 2 — Commerce 🔄 Next

**Goal:** Complete the full buying flow from cart to confirmed order with payments.

### What will be built
- **Cart page:** Full UI with quantity editing and item removal
- **Checkout:** Multi-step form — shipping address → payment method → confirmation
- **Stripe payments:** Pay with card (sandbox), handles failed payments
- **Offline payment:** Bank transfer option, admin approves or rejects manually
- **Orders:** Create order, view order history, order detail page
- **Email notifications:** Automatic email on order confirmation and payment update
- **Async queues:** Celery + RabbitMQ for background email sending

---

## Phase 3 — Admin & Polish 🔄 Planned

**Goal:** Full admin dashboard, automated tests, and production-ready setup.

### What will be built
- **Admin dashboard:** Manage products (add/edit/delete with image URL), manage orders, manage payments
- **Offline payment manager:** Admin approves or rejects pending bank transfers
- **User profile page:** View and edit personal info, see order history
- **Automated tests:** Backend (pytest ≥50% coverage) + Frontend (Jest ≥30% coverage)
- **CI/CD:** GitHub Actions runs tests automatically on every push
- **Docker:** Final Docker Compose with all services (PostgreSQL, backend, frontend, RabbitMQ, Celery)

---

## Admin Account (seeded)

| Field | Value |
|-------|-------|
| Email | admin@shoesbags.com |
| Password | admin123 |
