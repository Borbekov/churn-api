from pathlib import Path

import joblib
import pandas as pd
from sklearn.pipeline import Pipeline

from .schemas import Customer


def load_pipeline(path: Path) -> Pipeline:
    """Load a trained sklearn pipeline from disk"""
    return joblib.load(path)


def predict_churn_proba(pipeline: Pipeline, customer: Customer) -> float:
    """Return the probability that the customer will churn"""
    df = pd.DataFrame([customer.model_dump()])
    return round(float(pipeline.predict_proba(df)[0, 1]), 4)
