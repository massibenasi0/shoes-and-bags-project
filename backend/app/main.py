from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import admin, auth, categories, orders, payments, products

app = FastAPI(
    title="ShoesBags API",
    version="2.0.0",
    description="E-commerce REST API for shoes and bags",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(categories.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(payments.router)
app.include_router(admin.router)


@app.get("/api/health", tags=["health"])
def health_check():
    return {"status": "ok", "version": "1.0.0"}
