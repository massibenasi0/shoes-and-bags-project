import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.security import create_access_token, hash_password
from app.database import Base, get_db
from app.main import app
from app.models.category import Category
from app.models.product import Product
from app.models.user import User, UserRole

TEST_DATABASE_URL = "postgresql://shoesbags:shoesbags@localhost:5432/shoesbags_test"

engine = create_engine(TEST_DATABASE_URL)
TestSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function", autouse=False)
def db():
    Base.metadata.create_all(bind=engine)
    session = TestSession()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def test_user(db):
    user = User(
        email="user@example.com",
        hashed_password=hash_password("password123"),
        full_name="Test User",
        role=UserRole.CUSTOMER,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def admin_user(db):
    user = User(
        email="admin@example.com",
        hashed_password=hash_password("adminpass"),
        full_name="Admin User",
        role=UserRole.ADMIN,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def auth_headers(test_user):
    token = create_access_token(test_user.id, test_user.role.value)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def admin_headers(admin_user):
    token = create_access_token(admin_user.id, admin_user.role.value)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def category(db):
    cat = Category(name="Shoes", slug="shoes", description="Footwear")
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


@pytest.fixture
def product(db, category):
    p = Product(
        name="Test Shoe",
        slug="test-shoe",
        description="A test shoe",
        price=99.99,
        category_id=category.id,
        images=["https://placehold.co/600x400"],
        sizes=["40", "41"],
        colors=["Black"],
        stock=10,
        brand="TestBrand",
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return p
