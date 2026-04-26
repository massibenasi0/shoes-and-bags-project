from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class CategoryCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None


class CategoryResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    description: Optional[str]

    model_config = {"from_attributes": True}
