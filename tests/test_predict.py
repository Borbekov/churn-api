from typing import Any

import pytest
from fastapi.testclient import TestClient


def test_predict_valid(client: TestClient, valid_customer: dict[str, Any]):
    response = client.post("/predict", json=valid_customer)
    assert response.status_code == 200
    assert response.json() == {"churn_probability": 0.7}


@pytest.mark.parametrize(
    "field, value",
    [
        ("tenure", -5),
        ("tenure", "abc"),
        ("monthly_charges", 0),
        ("contract", "Weekly"),
        ("internet_service", "5G"),
        ("payment_method", "Cash"),
    ],
)
def test_predict_rejects_invalid_value(
    client: TestClient, valid_customer: dict[str, Any], field: str, value: any
):
    response = client.post("/predict", json={**valid_customer, field: value})
    assert response.status_code == 422
    # assert response.json()["detail"][0]["loc"] == ["body", field]
