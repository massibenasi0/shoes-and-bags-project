"""
Seed the database with initial data.
Run with: python -m app.seed
"""
from app.core.security import hash_password
from app.database import Base, SessionLocal, engine
from app.models import Category, Product, User, UserRole

SHOE_SIZES = ["36", "37", "38", "39", "40", "41"]

PRODUCTS = [
    # ── Shoes ────────────────────────────────────────────────────────────────
    dict(
        name="Classic Leather Sneakers",
        slug="classic-leather-sneakers",
        description="Premium full-grain leather sneakers crafted for everyday comfort and style. Features a cushioned insole and durable rubber outsole.",
        price=129.99,
        category_slug="shoes",
        images=[
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop&q=80",
        ],
        sizes=SHOE_SIZES,
        colors=["White", "Black"],
        stock=50,
        is_featured=True,
        brand="ShoesBags",
    ),
    dict(
        name="Running Pro Max",
        slug="running-pro-max",
        description="High-performance running shoes with responsive foam cushioning and breathable mesh upper. Built for speed and long-distance comfort.",
        price=189.99,
        compare_at_price=219.99,
        category_slug="shoes",
        images=[
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=400&fit=crop&q=80",
        ],
        sizes=SHOE_SIZES,
        colors=["Blue", "Red", "Black"],
        stock=30,
        is_featured=True,
        brand="ShoesBags",
    ),
    dict(
        name="Elegant Heels",
        slug="elegant-heels",
        description="Sophisticated stiletto heels with a pointed toe and suede finish. The perfect choice for formal occasions and evening events.",
        price=159.99,
        category_slug="shoes",
        images=[
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=400&fit=crop&q=80",
        ],
        sizes=SHOE_SIZES,
        colors=["Black", "Red", "Nude"],
        stock=25,
        brand="Elegance",
    ),
    dict(
        name="Canvas Slip-Ons",
        slug="canvas-slip-ons",
        description="Lightweight canvas slip-on shoes with a vulcanised rubber sole. Effortlessly casual for warm-weather days.",
        price=59.99,
        category_slug="shoes",
        images=[
            "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&h=400&fit=crop&q=80",
        ],
        sizes=SHOE_SIZES,
        colors=["Navy", "Grey", "White"],
        stock=100,
        brand="Casual Co",
    ),
    dict(
        name="Hiking Boots",
        slug="hiking-boots",
        description="Waterproof full-grain leather hiking boots with a grippy Vibram outsole and ankle support. Ready for any trail.",
        price=219.99,
        category_slug="shoes",
        images=[
            "https://images.unsplash.com/photo-1608256263-1af819a13858?w=600&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1608256263-1af819a13858?w=600&h=400&fit=crop&q=80",
        ],
        sizes=SHOE_SIZES,
        colors=["Brown", "Black"],
        stock=40,
        brand="TrailMaster",
    ),
    # ── Bags ─────────────────────────────────────────────────────────────────
    dict(
        name="Leather Tote Bag",
        slug="leather-tote-bag",
        description="Spacious genuine leather tote with interior zip pocket and magnetic snap closure. Perfect for work or a weekend out.",
        price=249.99,
        category_slug="bags",
        images=[
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=400&fit=crop&q=80",
        ],
        sizes=["One Size"],
        colors=["Tan", "Black", "Brown"],
        stock=35,
        is_featured=True,
        brand="BagCraft",
    ),
    dict(
        name="Crossbody Mini",
        slug="crossbody-mini",
        description="Compact crossbody bag with an adjustable strap and three interior compartments. Fits your phone, cards and essentials.",
        price=89.99,
        category_slug="bags",
        images=[
            "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=400&fit=crop&q=80",
        ],
        sizes=["One Size"],
        colors=["Black", "Pink", "Blue"],
        stock=60,
        is_featured=True,
        brand="Urban",
    ),
    dict(
        name="Laptop Backpack",
        slug="laptop-backpack",
        description="Professional 15\" laptop backpack with padded compartment, USB charging port and ergonomic shoulder straps.",
        price=79.99,
        compare_at_price=99.99,
        category_slug="bags",
        images=[
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop&q=80",
        ],
        sizes=["One Size"],
        colors=["Black", "Grey", "Navy"],
        stock=80,
        brand="TechPack",
    ),
    dict(
        name="Weekend Duffle",
        slug="weekend-duffle",
        description="Stylish waxed-canvas duffle bag with leather handles and a removable shoulder strap. Ideal for short trips.",
        price=149.99,
        category_slug="bags",
        images=[
            "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&h=400&fit=crop&q=80",
        ],
        sizes=["One Size"],
        colors=["Olive", "Black", "Tan"],
        stock=20,
        brand="Traveler",
    ),
    dict(
        name="Designer Clutch",
        slug="designer-clutch",
        description="Elegant satin evening clutch with gold chain strap and magnetic clasp. A statement piece for any occasion.",
        price=199.99,
        category_slug="bags",
        images=[
            "https://images.unsplash.com/photo-1563178406-4cdc2ba48d17?w=600&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1563178406-4cdc2ba48d17?w=600&h=400&fit=crop&q=80",
        ],
        sizes=["One Size"],
        colors=["Gold", "Silver", "Black"],
        stock=15,
        brand="Luxe",
    ),
]


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # ── Admin user ──────────────────────────────────────────────────────
        if not db.query(User).filter(User.email == "admin@shoesbags.com").first():
            db.add(User(
                email="admin@shoesbags.com",
                hashed_password=hash_password("admin123"),
                full_name="Admin User",
                role=UserRole.ADMIN,
            ))

        # ── Categories ──────────────────────────────────────────────────────
        shoes_cat = db.query(Category).filter(Category.slug == "shoes").first()
        if not shoes_cat:
            shoes_cat = Category(name="Shoes", slug="shoes", description="Footwear collection")
            db.add(shoes_cat)

        bags_cat = db.query(Category).filter(Category.slug == "bags").first()
        if not bags_cat:
            bags_cat = Category(name="Bags", slug="bags", description="Bags and accessories")
            db.add(bags_cat)

        db.flush()

        cat_map = {"shoes": shoes_cat.id, "bags": bags_cat.id}

        # ── Products (upsert: insert or update images/sizes/colors) ─────────
        for p in PRODUCTS:
            data = {k: v for k, v in p.items() if k != "category_slug"}
            data["category_id"] = cat_map[p["category_slug"]]

            existing = db.query(Product).filter(Product.slug == data["slug"]).first()
            if existing:
                existing.images = data["images"]
                existing.sizes = data["sizes"]
                existing.colors = data["colors"]
                existing.description = data["description"]
            else:
                db.add(Product(**data))

        db.commit()
        print("Seed data inserted/updated successfully!")
        print("  Admin: admin@shoesbags.com / admin123")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
