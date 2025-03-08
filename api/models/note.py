from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID, uuid4

class NoteBase(BaseModel):
    note_title: str
    note_content: str

class NoteCreate(NoteBase):
    pass

class NoteUpdate(NoteBase):
    note_title: Optional[str] = None
    note_content: Optional[str] = None

class NoteResponse(NoteBase):
    note_id: str
    user_id: str
    created_by: str
    # user_email: str
    created_on: int
    last_update: int
    # updated_by: Optional[str] = None
    # updated_by_email: Optional[str] = None

    class Config:
        from_attributes = True 