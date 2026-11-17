import numpy as np
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.dependencies import get_pipeline

client = TestClient(app)


class FakePipeline:
    def predict_proba(self, df):
        return np.array([[0.3, 0.7]])


@pytest.fixture
def client():
    app.dependency_overrides[get_pipeline] = lambda: FakePipeline()
    yield TestClient(app)
    app.dependency_overrides.clear()


@pytest.fixture
def valid_customer():
    return {
        "tenure": 5,
        "monthly_charges": 89.9,
        "contract": "Month-to-month",
        "internet_service": "Fiber optic",
        "payment_method": "Electronic check",
    }
