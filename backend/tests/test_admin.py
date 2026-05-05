def test_stats_admin(client, admin_headers):
    resp = client.get("/api/admin/stats", headers=admin_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "total_orders" in data
    assert "total_revenue" in data
    assert "pending_payments" in data
    assert "total_products" in data


def test_stats_non_admin(client, auth_headers):
    resp = client.get("/api/admin/stats", headers=auth_headers)
    assert resp.status_code == 403


def test_stats_unauthenticated(client):
    resp = client.get("/api/admin/stats")
    assert resp.status_code == 403


def test_get_all_orders_admin(client, admin_headers, auth_headers, product):
    client.post("/api/orders/", headers=auth_headers, json={
        "items": [{"product_id": str(product.id), "quantity": 1}],
        "shipping_address": {"street": "1 St", "city": "Warsaw", "state": "MA", "zip_code": "00-001", "country": "Poland"},
        "payment_method": "offline",
    })
    resp = client.get("/api/admin/orders", headers=admin_headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 1
    assert "user_email" in resp.json()[0]


def test_get_all_orders_non_admin(client, auth_headers):
    resp = client.get("/api/admin/orders", headers=auth_headers)
    assert resp.status_code == 403


def test_update_order_status(client, admin_headers, auth_headers, product):
    create = client.post("/api/orders/", headers=auth_headers, json={
        "items": [{"product_id": str(product.id), "quantity": 1}],
        "shipping_address": {"street": "1 St", "city": "Warsaw", "state": "MA", "zip_code": "00-001", "country": "Poland"},
        "payment_method": "offline",
    })
    order_id = create.json()["order_id"]
    resp = client.put(f"/api/admin/orders/{order_id}/status", headers=admin_headers, json={"status": "confirmed"})
    assert resp.status_code == 200
    # Verify the change
    orders = client.get("/api/admin/orders", headers=admin_headers).json()
    assert orders[0]["status"] == "confirmed"


def test_update_order_status_not_found(client, admin_headers):
    resp = client.put("/api/admin/orders/00000000-0000-0000-0000-000000000000/status",
                      headers=admin_headers, json={"status": "confirmed"})
    assert resp.status_code == 404


def test_get_all_payments_admin(client, admin_headers, auth_headers, product):
    client.post("/api/orders/", headers=auth_headers, json={
        "items": [{"product_id": str(product.id), "quantity": 1}],
        "shipping_address": {"street": "1 St", "city": "Warsaw", "state": "MA", "zip_code": "00-001", "country": "Poland"},
        "payment_method": "offline",
    })
    resp = client.get("/api/admin/payments", headers=admin_headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 1
    assert resp.json()[0]["method"] == "offline"


def test_get_all_products_admin(client, admin_headers, product):
    resp = client.get("/api/admin/products", headers=admin_headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 1


def test_update_profile(client, auth_headers):
    resp = client.put("/api/auth/me", headers=auth_headers, json={"full_name": "Updated Name"})
    assert resp.status_code == 200
    assert resp.json()["full_name"] == "Updated Name"


def test_update_profile_duplicate_email(client, auth_headers, admin_user):
    resp = client.put("/api/auth/me", headers=auth_headers, json={"email": admin_user.email})
    assert resp.status_code == 400
