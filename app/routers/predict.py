from typing import Annotated

import pandas as pd
from fastapi import APIRouter, Body, Request

from ..schemas import Customer, PredictionResponse

predict_router = APIRouter(tags=["prediction"])


@predict_router.post("/predict")
def predict(
    customer: Annotated[Customer, Body()], request: Request
) -> PredictionResponse:
    model = request.app.state.model
    df = pd.DataFrame([customer.model_dump()])
    proba = model.predict_proba(df)[0, 1]
    return PredictionResponse(churn_probability=round(float(proba), 4))
