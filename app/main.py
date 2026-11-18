from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI

from .routers import health, predict
from .ml import load_pipeline
from .config import settings

MODEL_PATH = (
    Path(__file__).resolve().parent.parent / "artifacts" / "churn_pipeline.joblib"
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.pipeline = load_pipeline(settings.pipeline_path)
    yield


app = FastAPI(
    title="Churn API",
    version="0.1.0",
    description="Predicts customer churn probability for a telecom company.",
    lifespan=lifespan,
)

app.include_router(health.health_router)
app.include_router(predict.predict_router)
app.frontend("/", directory="frontend/dist")
