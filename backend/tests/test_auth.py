def test_register(client):
    resp = client.post("/api/auth/register", json={
        "email": "new@example.com",
        "password": "password123",
        "full_name": "New User",
    })
    assert resp.status_code == 201
    data = resp.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


def test_register_duplicate_email(client, test_user):
    resp = client.post("/api/auth/register", json={
        "email": "user@example.com",
        "password": "password123",
        "full_name": "Duplicate",
    })
    assert resp.status_code == 400
    assert "already registered" in resp.json()["detail"]


def test_login_success(client, test_user):
    resp = client.post("/api/auth/login", json={
        "email": "user@example.com",
        "password": "password123",
    })
    assert resp.status_code == 200
    assert "access_token" in resp.json()


def test_login_wrong_password(client, test_user):
    resp = client.post("/api/auth/login", json={
        "email": "user@example.com",
        "password": "wrongpass",
    })
    assert resp.status_code == 401


def test_login_unknown_email(client):
    resp = client.post("/api/auth/login", json={
        "email": "nobody@example.com",
        "password": "anything",
    })
    assert resp.status_code == 401


def test_get_me(client, auth_headers):
    resp = client.get("/api/auth/me", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["email"] == "user@example.com"
    assert resp.json()["role"] == "customer"


def test_get_me_unauthenticated(client):
    resp = client.get("/api/auth/me")
    assert resp.status_code == 403


def test_token_refresh(client, test_user):
    login = client.post("/api/auth/login", json={
        "email": "user@example.com",
        "password": "password123",
    })
    refresh_token = login.json()["refresh_token"]
    resp = client.post("/api/auth/refresh", json={"refresh_token": refresh_token})
    assert resp.status_code == 200
    assert "access_token" in resp.json()


def test_token_refresh_invalid(client):
    resp = client.post("/api/auth/refresh", json={"refresh_token": "not-a-token"})
    assert resp.status_code == 401
