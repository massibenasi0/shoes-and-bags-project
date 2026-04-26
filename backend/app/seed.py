"""
Seed the database with initial data.
Run with: python -m app.seed
"""
from app.core.security import hash_password
from app.database import Base, SessionLocal, engine
from app.models import Category, Product, User, UserRole


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

        # ── Products ────────────────────────────────────────────────────────
        ph = "https://placehold.co/600x400?text="
        products_data = [
            # Shoes
            dict(name="Classic Leather Sneakers", slug="classic-leather-sneakers",
                 description="Premium leather sneakers for everyday wear.", price=129.99,
                 category_id=shoes_cat.id, images=[f"{ph}Sneakers"],
                 sizes=["38","39","40","41","42","43","44"], colors=["White","Black"],
                 stock=50, is_featured=True, brand="ShoesBags"),
            dict(name="Running Pro Max", slug="running-pro-max",
                 description="High-performance running shoes with responsive cushioning.",
                 price=189.99, compare_at_price=219.99, category_id=shoes_cat.id,
                 images=[f"{ph}Running"], sizes=["39","40","41","42","43"],
                 colors=["Blue","Red","Black"], stock=30, is_featured=True, brand="ShoesBags"),
            dict(name="Elegant Heels", slug="elegant-heels",
                 description="Stylish heels for special occasions.", price=159.99,
                 category_id=shoes_cat.id, images=[f"{ph}Heels"],
                 sizes=["36","37","38","39","40"], colors=["Black","Red","Nude"],
                 stock=25, brand="Elegance"),
            dict(name="Canvas Slip-Ons", slug="canvas-slip-ons",
                 description="Casual canvas slip-on shoes, perfect for summer.", price=59.99,
                 category_id=shoes_cat.id, images=[f"{ph}SlipOns"],
                 sizes=["38","39","40","41","42","43"], colors=["Navy","Grey","White"],
                 stock=100, brand="Casual Co"),
            dict(name="Hiking Boots", slug="hiking-boots",
                 description="Durable waterproof hiking boots for any terrain.", price=219.99,
                 category_id=shoes_cat.id, images=[f"{ph}Boots"],
                 sizes=["39","40","41","42","43","44","45"], colors=["Brown","Black"],
                 stock=40, brand="TrailMaster"),
            # Bags
            dict(name="Leather Tote Bag", slug="leather-tote-bag",
                 description="Spacious genuine leather tote for work or weekend.", price=249.99,
                 category_id=bags_cat.id, images=[f"{ph}Tote"],
                 sizes=["One Size"], colors=["Tan","Black","Brown"],
                 stock=35, is_featured=True, brand="BagCraft"),
            dict(name="Crossbody Mini", slug="crossbody-mini",
                 description="Compact crossbody bag for everyday essentials.", price=89.99,
                 category_id=bags_cat.id, images=[f"{ph}Crossbody"],
                 sizes=["One Size"], colors=["Black","Pink","Blue"],
                 stock=60, is_featured=True, brand="Urban"),
            dict(name="Laptop Backpack", slug="laptop-backpack",
                 description="Professional 15\" laptop backpack with USB charging port.",
                 price=79.99, compare_at_price=99.99, category_id=bags_cat.id,
                 images=[f"{ph}Backpack"], sizes=["One Size"],
                 colors=["Black","Grey","Navy"], stock=80, brand="TechPack"),
            dict(name="Weekend Duffle", slug="weekend-duffle",
                 description="Stylish duffle bag for weekend getaways.", price=149.99,
                 category_id=bags_cat.id, images=[f"{ph}Duffle"],
                 sizes=["One Size"], colors=["Olive","Black","Tan"],
                 stock=20, brand="Traveler"),
            dict(name="Designer Clutch", slug="designer-clutch",
                 description="Elegant evening clutch with gold hardware.", price=199.99,
                 category_id=bags_cat.id, images=[f"{ph}Clutch"],
                 sizes=["One Size"], colors=["Gold","Silver","Black"],
                 stock=15, brand="Luxe"),
        ]

        for p_data in products_data:
            if not db.query(Product).filter(Product.slug == p_data["slug"]).first():
                db.add(Product(**p_data))

        db.commit()
        print("Seed data inserted successfully!")
        print("  Admin: admin@shoesbags.com / admin123")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
