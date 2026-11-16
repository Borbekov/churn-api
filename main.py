from fastapi import FastAPI

app = FastAPI(
    title="Churn API",
    version="0.1.0",
    description="Predicts customer churn probability for a telecom company.",
)


@app.get("/health", tags=["system"])
async def health_check():
    return {"status": "OK"}
