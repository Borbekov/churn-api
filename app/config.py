from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

ROOT = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    pipeline_path: Path = ROOT / "artifacts" / "churn_pipeline.joblib"

    frontend_dist_path: Path = ROOT / "frontend" / "dist"


settings = Settings()
