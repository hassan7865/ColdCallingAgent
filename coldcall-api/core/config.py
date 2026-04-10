from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str
    app_version: str
    app_env: str
    api_prefix: str
    frontend_origin: str

    postgres_user: str | None = None
    postgres_password: str | None = None
    postgres_host: str | None = None
    postgres_port: int | None = None
    postgres_db: str | None = None
    database_url: str

    jwt_secret_key: str
    jwt_algorithm: str
    access_token_expire_minutes: int
    refresh_token_expire_days: int
    access_cookie_name: str
    refresh_cookie_name: str
    cookie_secure: bool
    cookie_samesite: str
    cookie_domain: str | None = None



@lru_cache
def get_settings() -> Settings:
    return Settings()

