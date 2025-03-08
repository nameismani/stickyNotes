from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from uuid import UUID, uuid4

class UserBase(BaseModel):
    user_name: str
    user_email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    user_id: UUID = Field(default_factory=uuid4)
    last_update: int = Field(default_factory=lambda: int(datetime.utcnow().timestamp()))
    create_on: int = Field(default_factory=lambda: int(datetime.utcnow().timestamp()))

    class Config:
        from_attributes = True 