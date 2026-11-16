from fastapi import APIRouter

health_router = APIRouter(tags=["system"])


@health_router.get("/health")
async def health_check():
    return {"health_status": "OK"}
