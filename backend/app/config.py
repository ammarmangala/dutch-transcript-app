from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    openai_api_key: str
    allowed_origins: list[str] = ["http://localhost:3000"]
    # Optioneel: shared secret tussen BFF en FastAPI (aanbevolen in productie)
    x_internal_token: str | None = None

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
