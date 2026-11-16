from typing import Annotated

from fastapi import APIRouter, Body

from ..schemas import Customer, PredictionResponse

predict_router = APIRouter(tags=["prediction"])


@predict_router.post("/predict")
def predict(customer: Annotated[Customer, Body()]) -> PredictionResponse:
    return PredictionResponse(churn_probability=0.5)
