# How to Run ShoesBags

## Every time you want to start the project

### Step 1 — Stop Docker (if running)
```bash
docker compose down
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

### Step 3 — Open Terminal 2 (Frontend)
```bash
cd /Users/macosmonterey/Desktop/projects/shoesbags/frontend
npm run dev
```
Wait until you see:
```
➜  Local:   http://localhost:3000/
```

### Step 4 — Open the website
Go to your browser and visit:
```
http://localhost:3000
```

---

## Login credentials
| Role | Email | Password |
|---|---|---|
| Admin | admin@shoesbags.com | admin123 |

---

## To stop the project
Press **Ctrl+C** in each terminal.

---

## If PostgreSQL is not running (after a Mac reboot)
```bash
brew services start postgresql@16
```

---

## Important rules
- Always stop Docker before running from terminal
- Both terminals must stay open while using the website
- Terminal 1 = Backend (API) — must run first
- Terminal 2 = Frontend (Website)
