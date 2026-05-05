# ShoesBags — Phase 3 Documentation

**Student:** Mesroua Abderrahmen Massinissa, Jaadi Mohamed, Sami Dahmouni
**University:** Kielce University of Technology
**Field:** Computer Science

---

## What is Phase 3

Phase 3 is the final part of the project. The goal was to build the admin dashboard, complete the user profile page, write automated tests, and set up CI/CD so tests run automatically on every code push.

---

## 1. Admin Dashboard

The admin dashboard is accessible at `/admin` and is only visible to users with the admin role.

### Stats Bar
At the top of the dashboard there are 4 cards showing live data from the database:
- Total number of orders placed
- Total revenue (sum of all non-cancelled orders)
- Number of offline payments waiting for approval
- Total number of active products

### Products Tab
- Shows all products in a table with photo, name, price, stock and status
- **Add Product** button opens a form to create a new product
- Each product has an **Edit** button that opens the same form pre-filled
- Each product has a **Delete** button that removes it from the store (soft delete — it disappears from the catalog but stays in the database)
- The form supports: name, price, compare-at price, stock, brand, category, sizes, colors, image URLs, description

### Orders Tab
- Shows every order from every customer (not just the logged-in user)
- Each row shows: order ID, customer name and email, date, total, number of items, status
- The status can be changed directly from a dropdown: pending → confirmed → shipped → delivered → cancelled
- The change saves instantly to the database

### Payments Tab
- Shows all payments (Stripe card payments and offline bank transfers)
- Each row shows: order ID, customer email, amount, payment method, current status
- For offline payments with status **offline_pending**, two buttons appear:
  - **Approve** — marks the payment as approved and confirms the order
  - **Reject** — marks the payment as rejected

---

## 2. User Profile Page

The profile page is accessible at `/profile` for any logged-in user.

### What it shows
- Avatar circle with the user's initials
- Full name with an **Edit** button
- Email address
- Role badge (customer or admin)
- Member since date

### Name editing
- Click **Edit** next to the name
- An input field appears with the current name
- Type the new name and click **Save**
- The name updates in the database and on the page immediately
- Click **Cancel** to discard the change

### Recent orders
- The last 3 orders are shown below the profile info
- Each shows the order ID, date, number of items, total and status
- Clicking an order opens the order detail page
- A **View My Orders** link goes to the full order history

---

## 3. New API Endpoints

| Method | Endpoint | Who | Description |
|--------|----------|-----|-------------|
| PUT | `/api/auth/me` | Logged-in user | Update full name or email |
| GET | `/api/admin/stats` | Admin only | Dashboard statistics |
| GET | `/api/admin/orders` | Admin only | All orders from all users |
| PUT | `/api/admin/orders/{id}/status` | Admin only | Update order status |
| GET | `/api/admin/payments` | Admin only | All payments |
| GET | `/api/admin/products` | Admin only | All products including inactive |

---

## 4. Automated Tests

### Backend — pytest

**File:** `backend/tests/test_orders.py`

Tests for the orders API:
- Placing an order without being logged in → should return 403
- Placing an offline order → should return 201 with order ID and total
- Placing an order with empty items → should return 400
- Placing an order with a product that doesn't exist → should return 400
- Listing orders when none exist → should return empty list
- Listing orders after placing one → should return 1 order
- Getting a specific order by ID → should return the correct order
- Getting an order that doesn't exist → should return 404
- Orders from one user should not be visible to another user

**File:** `backend/tests/test_admin.py`

Tests for the admin API:
- Getting stats as admin → should return all 4 numbers
- Getting stats as regular user → should return 403
- Getting stats without login → should return 403
- Getting all orders as admin → should include user email
- Getting all orders as regular user → should return 403
- Updating order status → should change the status in the database
- Updating a non-existent order → should return 404
- Getting all payments as admin → should return payment method
- Getting all products as admin → should return all products
- Updating profile name → should return the new name
- Updating profile with an already used email → should return 400

### Frontend — Jest

**File:** `frontend/src/__tests__/store/orderSlice.test.ts`

Tests for the orders Redux slice:
- Initial state should have empty orders list
- `clearOrderError` should set error to null
- `clearCurrentOrder` should set currentOrder to null
- `fetchOrders.pending` should set loading to true
- `fetchOrders.fulfilled` should populate the orders list
- `fetchOrders.rejected` should set the error message
- `fetchOrder.fulfilled` should set the currentOrder

---

## 5. CI/CD — GitHub Actions

**File:** `.github/workflows/ci.yml`

Every time code is pushed to the `main` branch on GitHub, two jobs run automatically:

### Backend job
1. Starts a PostgreSQL test database
2. Installs Python dependencies
3. Runs `pytest` with coverage report
4. Fails if coverage is below 50%

### Frontend job
1. Installs Node.js dependencies
2. Runs `jest` with coverage report
3. Fails if line coverage is below 30%

The results are visible in the **Actions** tab on the GitHub repository. A green checkmark means all tests passed. A red X means something failed and needs to be fixed.

---

## 6. Files Added or Changed

### New files
| File | Description |
|------|-------------|
| `backend/app/routers/admin.py` | All admin API endpoints |
| `backend/tests/test_orders.py` | Order API tests |
| `backend/tests/test_admin.py` | Admin API tests |
| `frontend/src/api/admin.ts` | Admin API client functions |
| `frontend/src/__tests__/store/orderSlice.test.ts` | Order slice tests |
| `.github/workflows/ci.yml` | GitHub Actions CI/CD workflow |

### Modified files
| File | What changed |
|------|-------------|
| `backend/app/routers/auth.py` | Added `PUT /api/auth/me` endpoint |
| `backend/app/main.py` | Registered the admin router |
| `frontend/src/pages/AdminDashboardPage.tsx` | Full implementation (was a placeholder) |
| `frontend/src/pages/UserProfilePage.tsx` | Full implementation (was a placeholder) |
| `frontend/src/i18n/en.json` | Added admin and profile translation keys |
| `frontend/src/i18n/pl.json` | Added Polish translations |

---

## 7. Admin Account

| Field | Value |
|-------|-------|
| Email | admin@shoesbags.com |
| Password | massi |
