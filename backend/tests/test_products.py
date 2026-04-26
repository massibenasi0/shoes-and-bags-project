def test_list_products_empty(client):
    resp = client.get("/api/products")
    assert resp.status_code == 200
    assert resp.json()["total"] == 0
    assert resp.json()["items"] == []


def test_list_products(client, product):
    resp = client.get("/api/products")
    assert resp.status_code == 200
    assert resp.json()["total"] == 1
    assert resp.json()["items"][0]["name"] == "Test Shoe"


def test_get_product(client, product):
    resp = client.get(f"/api/products/{product.id}")
    assert resp.status_code == 200
    assert resp.json()["slug"] == "test-shoe"


def test_get_product_not_found(client):
    resp = client.get("/api/products/00000000-0000-0000-0000-000000000000")
    assert resp.status_code == 404


def test_create_product_admin(client, admin_headers, category):
    resp = client.post("/api/products", headers=admin_headers, json={
        "name": "New Shoe",
        "price": 79.99,
        "category_id": str(category.id),
        "stock": 5,
    })
    assert resp.status_code == 201
    assert resp.json()["name"] == "New Shoe"
    assert resp.json()["slug"] == "new-shoe"


def test_create_product_non_admin(client, auth_headers, category):
    resp = client.post("/api/products", headers=auth_headers, json={
        "name": "New Shoe",
        "price": 79.99,
        "category_id": str(category.id),
    })
    assert resp.status_code == 403


def test_create_product_unauthenticated(client, category):
    resp = client.post("/api/products", json={
        "name": "New Shoe",
        "price": 79.99,
        "category_id": str(category.id),
    })
    assert resp.status_code == 403


def test_update_product_admin(client, admin_headers, product):
    resp = client.put(f"/api/products/{product.id}", headers=admin_headers, json={
        "price": 149.99,
    })
    assert resp.status_code == 200
    assert float(resp.json()["price"]) == 149.99


def test_delete_product_admin(client, admin_headers, product):
    resp = client.delete(f"/api/products/{product.id}", headers=admin_headers)
    assert resp.status_code == 204
    # Soft deleted — not returned in list
    resp2 = client.get("/api/products")
    assert resp2.json()["total"] == 0


def test_filter_by_min_price(client, admin_headers, category):
    client.post("/api/products", headers=admin_headers, json={
        "name": "Cheap Shoe", "price": 30.00, "category_id": str(category.id), "stock": 5,
    })
    client.post("/api/products", headers=admin_headers, json={
        "name": "Expensive Shoe", "price": 300.00, "category_id": str(category.id), "stock": 5,
    })
    resp = client.get("/api/products?min_price=100")
    assert resp.json()["total"] == 1
    assert resp.json()["items"][0]["name"] == "Expensive Shoe"


def test_filter_by_search(client, admin_headers, category):
    client.post("/api/products", headers=admin_headers, json={
        "name": "Running Shoe", "price": 100.00, "category_id": str(category.id),
    })
    resp = client.get("/api/products?search=running")
    assert resp.json()["total"] == 1
