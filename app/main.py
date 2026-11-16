from contextlib import asynccontextmanager
from pathlib import Path

import joblib
from fastapi import FastAPI

from .routers import health, predict

MODEL_PATH = (
    Path(__file__).resolve().parent.parent / "artifacts" / "churn_pipeline.joblib"
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.model = joblib.load(MODEL_PATH)
    yield


app = FastAPI(
    title="Churn API",
    version="0.1.0",
    description="Predicts customer churn probability for a telecom company.",
    lifespan=lifespan,
)

app.include_router(health.health_router)
app.include_router(predict.predict_router)
