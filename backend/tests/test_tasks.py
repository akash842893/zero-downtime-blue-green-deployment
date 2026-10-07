import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_task_crud_lifecycle():
    # 1. Create task
    create_payload = {
        "title": "Verify Blue-Green Traffic Routing",
        "description": "Ensure zero requests drop during deployment switch",
        "status": "TODO"
    }
    create_res = client.post("/api/tasks", json=create_payload)
    assert create_res.status_code == 201
    created_task = create_res.json()
    assert created_task["title"] == create_payload["title"]
    assert created_task["status"] == "TODO"
    task_id = created_task["id"]

    # 2. List tasks
    list_res = client.get("/api/tasks")
    assert list_res.status_code == 200
    tasks = list_res.json()
    assert any(t["id"] == task_id for t in tasks)

    # 3. Get task by ID
    get_res = client.get(f"/api/tasks/{task_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == task_id

    # 4. Update task status
    update_payload = {
        "status": "IN_PROGRESS",
        "description": "Updated active environment pool"
    }
    update_res = client.put(f"/api/tasks/{task_id}", json=update_payload)
    assert update_res.status_code == 200
    updated_task = update_res.json()
    assert updated_task["status"] == "IN_PROGRESS"
    assert updated_task["description"] == "Updated active environment pool"

    # 5. Delete task
    delete_res = client.delete(f"/api/tasks/{task_id}")
    assert delete_res.status_code == 204

    # 6. Verify 404 after deletion
    get_after_delete = client.get(f"/api/tasks/{task_id}")
    assert get_after_delete.status_code == 404
