churn-api/
├── app/
│   ├── __init__.py
│   ├── main.py            # создание app, lifespan, подключение роутеров
│   ├── schemas.py         # Customer, PredictionResponse          ← Шаг 2
│   ├── ml.py              # загрузка модели, функция predict      ← Шаг 4
│   ├── dependencies.py    # get_model, verify_api_key             ← Шаг 4–5
│   ├── config.py          # Settings (pydantic-settings)          ← Шаг 5
│   └── routers/
│       ├── __init__.py
│       ├── health.py      # /health
│       └── predict.py     # /predict
├── scripts/
│   └── train.py           # обучение и сохранение модели          ← Шаг 3
├── models/                # churn_pipeline.joblib
├── data/                  # CSV (в .gitignore)
├── tests/
│   └── test_predict.py                                            ← Шаг 6
├── .gitignore
├── pyproject.toml
├── uv.lock
└── README.md



tenure - Number of months the customer has stayed with the company
monthly_charges - The amount charged to the customer monthly
сontract - The contract term of the customer (Month-to-month, One year, Two year)
internet_service - Customer’s internet service provider (DSL, Fiber optic, No)
payment_method - The customer’s payment method (Electronic check, Mailed check, Bank transfer (automatic), Credit card (automatic))