from typing import Annotated

import pandas as pd
from fastapi import APIRouter, Body

from ..schemas import Customer, PredictionResponse
from ..dependencies import PipelineDep
from ..ml import predict_churn_proba

predict_router = APIRouter(tags=["prediction"])


@predict_router.post("/predict")
def predict(
    customer: Annotated[Customer, Body()], pipeline: PipelineDep
) -> PredictionResponse:
    return PredictionResponse(churn_probability=predict_churn_proba(pipeline, customer))
