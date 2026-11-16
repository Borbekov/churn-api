from typing import Literal

from pydantic import BaseModel, Field


class Customer(BaseModel):
    tenure: int = Field(ge=0, description="Months with the company")
    monthly_charges: float = Field(gt=0, description="Current monthly bill")
    contract: Literal["Month-to-month", "One year", "Two year"]
    internet_service: Literal["DSL", "Fiber optic", "No"]
    payment_method: Literal[
        "Electronic check",
        "Mailed check",
        "Bank transfer (automatic)",
        "Credit card (automatic)",
    ]

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "tenure": 5,
                    "monthly_charges": 89.9,
                    "contract": "Month-to-month",
                    "internet_service": "Fiber optic",
                    "payment_method": "Electronic check",
                }
            ]
        }
    }


class PredictionResponse(BaseModel):
    churn_probability: float = Field(ge=0, le=1)
