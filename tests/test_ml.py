from fastapi.testclient import TestClient

from app.ml import load_pipeline
from app.config import settings
from app.schemas import Customer


def test_load_pipelne(client: TestClient):
    pipeline = load_pipeline(settings.pipeline_path)
    assert set(Customer.model_fields) == set(pipeline.feature_names_in_)
