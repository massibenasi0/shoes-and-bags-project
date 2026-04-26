# ShoesBags — Project Requirements Status

E-commerce platform for shoes and bags. Built with FastAPI (Python) + React + PostgreSQL.

---

## Technical Requirements

| Requirement | Status | Notes |
|-------------|--------|-------|
| REST API pattern | ✅ Done | FastAPI backend exposing a full REST API |
| Backend not JS/Node/TS | ✅ Done | Backend is Python 3.12 with FastAPI |
| OAuth2 Social Media login | ✅ Done | Google OAuth2 implemented (backend + frontend) |
| Electronic payment (Stripe) | 🔄 Phase 2 | Stripe sandbox integration planned |
| Failed payment handling | 🔄 Phase 2 | Negative scenarios handled in checkout flow |
| Offline payment approval (admin) | 🔄 Phase 2 | Admin can approve/reject bank transfer payments |
| Async message queues (RabbitMQ) | 🔄 Phase 2 | Celery + RabbitMQ for email notifications |
| Automated tests (≥50% coverage) | 🔄 Phase 3 | pytest (backend) + Jest (frontend) |

---

## Implemented Features (Phase 1)

### Backend
- User registration and login with hashed passwords (bcrypt)
- JWT access + refresh token authentication
- Google OAuth2 login flow
- Products API — list, filter, search, sort, pagination
- Categories API
- Role-based access control (user / admin)
- Database models: User, Product, Category, Order, Payment
- Alembic database migrations
- Database seeded with 10 products + admin account
- Auto-generated Swagger/OpenAPI docs at `/docs`

### Frontend
- Product listing page with filters (category, brand, price range), search and sort
- Product detail page with size/color selector and add-to-cart
- Login and Register pages
- Google login button
- Cart state managed with Redux (add, remove, update quantity)
- Protected routes (user and admin)
- Dark / Light theme toggle (persisted)
- English / Polish language toggle (persisted, full translations)
- Responsive design with mobile menu

---

## Documentation

| Item | Status | Notes |
|------|--------|-------|
| Project objective & functionalities | ✅ Done | This document + README |
| Database schema (ERD) | ✅ Done | Models: User, Product, Category, Order, Payment |
| API documentation (Swagger) | ✅ Done | Auto-generated at `http://localhost:8000/docs` |
| Use Case Diagram (UML) | 🔄 Phase 3 | To be added to final report |
| Class / Architecture Diagram | 🔄 Phase 3 | To be added to final report |
| Async mechanisms description | 🔄 Phase 2 | After RabbitMQ integration |
| Test report | 🔄 Phase 3 | After test suites are written |
| Installation manual | ✅ Done | See `RUNNING.md` |

---

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.12, FastAPI, SQLAlchemy, Alembic |
| Database | PostgreSQL |
| Auth | JWT (python-jose), bcrypt, Google OAuth2 |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| State | Redux Toolkit |
| i18n | i18next (EN / PL) |
| Payments | Stripe (Phase 2) |
| Queues | Celery + RabbitMQ (Phase 2) |
| Tests | pytest + Jest (Phase 3) |
