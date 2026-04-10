from typing import Any, Generic, Literal, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class Envelope(BaseModel, Generic[T]):
    status: Literal["success", "error"]
    message: str
    data: T | None


def success_response(message: str, data: Any = None) -> Envelope[Any]:
    return Envelope(status="success", message=message, data=data)


def error_response(message: str, data: Any = None) -> Envelope[Any]:
    return Envelope(status="error", message=message, data=data)

