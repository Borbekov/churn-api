from fastapi import FastAPI

from .routers import health

app = FastAPI(
    title="Churn API",
    version="0.1.0",
    description="Predicts customer churn probability for a telecom company.",
)

app.include_router(health.health_router)
