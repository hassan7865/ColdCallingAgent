from typing import Annotated, Any

from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator

PasswordStr = Annotated[str, Field(min_length=8, max_length=128)]
NameStr = Annotated[str, Field(min_length=2, max_length=100)]


def _normalize_email_in_payload(data: Any) -> Any:
    if not isinstance(data, dict):
        return data
    email = data.get("email")
    if isinstance(email, str):
        return {**data, "email": email.strip().lower()}
    return data


class RegisterRequest(BaseModel):
    email: EmailStr
    password: PasswordStr
    name: NameStr

    @model_validator(mode="before")
    @classmethod
    def normalize_email(cls, data: Any) -> Any:
        return _normalize_email_in_payload(data)


class LoginRequest(BaseModel):
    email: EmailStr
    password: PasswordStr

    @model_validator(mode="before")
    @classmethod
    def normalize_email(cls, data: Any) -> Any:
        return _normalize_email_in_payload(data)


class UserMeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    email: EmailStr
    name: str
    role: str

