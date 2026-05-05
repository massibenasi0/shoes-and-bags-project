def test_place_order_unauthenticated(client, product):
    resp = client.post("/api/orders/", json={
        "items": [{"product_id": str(product.id), "quantity": 1}],
        "shipping_address": {"street": "123 Main St", "city": "Warsaw", "state": "MA", "zip_code": "00-001", "country": "Poland"},
        "payment_method": "offline",
    })
    assert resp.status_code == 403


def test_place_order_offline(client, auth_headers, product):
    resp = client.post("/api/orders/", headers=auth_headers, json={
        "items": [{"product_id": str(product.id), "quantity": 2}],
        "shipping_address": {"street": "123 Main St", "city": "Warsaw", "state": "MA", "zip_code": "00-001", "country": "Poland"},
        "payment_method": "offline",
    })
    assert resp.status_code == 201
    data = resp.json()
    assert "order_id" in data
    assert data["payment_method"] == "offline"
    assert data["total_amount"] == pytest.approx(199.98, rel=1e-2)


def test_place_order_empty_items(client, auth_headers):
    resp = client.post("/api/orders/", headers=auth_headers, json={
        "items": [],
        "shipping_address": {"street": "123 Main St", "city": "Warsaw", "state": "MA", "zip_code": "00-001", "country": "Poland"},
        "payment_method": "offline",
    })
    assert resp.status_code == 400


def test_place_order_invalid_product(client, auth_headers):
    resp = client.post("/api/orders/", headers=auth_headers, json={
        "items": [{"product_id": "00000000-0000-0000-0000-000000000000", "quantity": 1}],
        "shipping_address": {"street": "123 Main St", "city": "Warsaw", "state": "MA", "zip_code": "00-001", "country": "Poland"},
        "payment_method": "offline",
    })
    assert resp.status_code == 400


def test_list_orders_empty(client, auth_headers):
    resp = client.get("/api/orders/", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json() == []


def test_list_orders(client, auth_headers, product):
    client.post("/api/orders/", headers=auth_headers, json={
        "items": [{"product_id": str(product.id), "quantity": 1}],
        "shipping_address": {"street": "123 Main St", "city": "Warsaw", "state": "MA", "zip_code": "00-001", "country": "Poland"},
        "payment_method": "offline",
    })
    resp = client.get("/api/orders/", headers=auth_headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 1
    assert resp.json()[0]["status"] == "pending"


def test_get_order_by_id(client, auth_headers, product):
    create = client.post("/api/orders/", headers=auth_headers, json={
        "items": [{"product_id": str(product.id), "quantity": 1}],
        "shipping_address": {"street": "123 Main St", "city": "Warsaw", "state": "MA", "zip_code": "00-001", "country": "Poland"},
        "payment_method": "offline",
    })
    order_id = create.json()["order_id"]
    resp = client.get(f"/api/orders/{order_id}", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["id"] == order_id


def test_get_order_not_found(client, auth_headers):
    resp = client.get("/api/orders/00000000-0000-0000-0000-000000000000", headers=auth_headers)
    assert resp.status_code == 404


def test_orders_isolated_per_user(client, auth_headers, admin_headers, product):
    # Place order as regular user
    client.post("/api/orders/", headers=auth_headers, json={
        "items": [{"product_id": str(product.id), "quantity": 1}],
        "shipping_address": {"street": "123 Main St", "city": "Warsaw", "state": "MA", "zip_code": "00-001", "country": "Poland"},
        "payment_method": "offline",
    })
    # Admin should see no orders in their own list
    resp = client.get("/api/orders/", headers=admin_headers)
    assert resp.json() == []


import pytest
