"""Train the churn model and save the pipeline to artifacts/"""

from pathlib import Path

import joblib
import json

import pandas as pd

import sklearn
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import roc_auc_score

ROOT = Path(__file__).resolve().parent.parent
DATA_PATH = ROOT / "data" / "Telco-Customer-Churn.csv"
ARTIFACTS_DIR = ROOT / "artifacts"


COLUMNS = {
    "tenure": "tenure",
    "MonthlyCharges": "monthly_charges",
    "Contract": "contract",
    "InternetService": "internet_service",
    "PaymentMethod": "payment_method",
}
NUMERIC = ["tenure", "monthly_charges"]
CATEGORICAL = ["contract", "internet_service", "payment_method"]
RANDOM_STATE = 42


def load_data() -> tuple[pd.DataFrame, pd.Series]:
    """Load CSV, select v1 features, rename columns to snake_case."""
    df = pd.read_csv(DATA_PATH).set_index("customerID")
    X = df[list(COLUMNS)].rename(columns=COLUMNS)
    y = (df["Churn"] == "Yes").astype(int)
    return (X, y)


def build_pipeline() -> Pipeline:
    """ColumnTransformer (scaler + one-hot) + LogisticRegression."""
    preprocess = ColumnTransformer(
        [("num", StandardScaler(), NUMERIC), ("cat", OneHotEncoder(), CATEGORICAL)]
    )
    return Pipeline(
        [
            ("preprocess", preprocess),
            ("model", LogisticRegression()),
        ]
    )


def main():
    # 1. load_data → 2. stratified train/test split → 3. fit
    # 4. ROC-AUC на тесте → 5. сохранить pipeline + metadata.json
    X, y = load_data()
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
    )
    pipeline = build_pipeline().fit(X_train, y_train)
    # y_pred = pipeline.predict(X_test)
    y_proba = pipeline.predict_proba(X_test)[:, 1]
    scores = cross_val_score(build_pipeline(), X, y, cv=5, scoring="roc_auc")
    metrics = {
        "roc_auc": roc_auc_score(y_test, y_proba),
        "roc_auc_cv": scores.mean(),
    }

    ARTIFACTS_DIR.mkdir(exist_ok=True)
    joblib.dump(pipeline, ARTIFACTS_DIR / "churn_pipeline.joblib")

    metada = {
        **metrics,
        "features": list(COLUMNS.values()),
        "sklearn_version": sklearn.__version__,
    }
    (ARTIFACTS_DIR / "metadata.json").write_text(json.dumps(metada, indent=2))


if __name__ == "__main__":
    main()
