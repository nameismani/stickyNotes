from fastapi import APIRouter, HTTPException, status, Depends, Request
from models.note import NoteCreate, NoteUpdate, NoteResponse
from db.mongodb import Database
from middleware.auth_middleware import get_user_from_token
from uuid import uuid4
import time
from typing import List

router = APIRouter(
    prefix="/api/notes",
    tags=["notes"]
)

@router.post("/", response_model=NoteResponse)
async def create_note(
    request: Request,
    note: NoteCreate,
    _=Depends(get_user_from_token)
):
    db = await Database.get_db()
    user = request.state.user
    
    current_timestamp = int(time.time())
    note_dict = note.dict()
    note_dict.update({
        "note_id": str(uuid4()),
        "user_id": user["user_id"],
        "created_by": user["user_name"],
        # "user_email": user["user_email"],
        "created_on": current_timestamp,
        "last_update": current_timestamp
    })
    
    await db.notes.insert_one(note_dict)
    return NoteResponse(**note_dict)

@router.get("/", response_model=List[NoteResponse])
async def get_user_notes(
    request: Request,
    _=Depends(get_user_from_token)
):
    db = await Database.get_db()
    user_id = request.state.user_id
    notes = await db.notes.find({"user_id": user_id}).to_list(None)
    return [NoteResponse(**note) for note in notes]

@router.get("/{note_id}", response_model=NoteResponse)
async def get_note(
    note_id: str,
    request: Request,
    _=Depends(get_user_from_token)
):
    db = await Database.get_db()
    user_id = request.state.user_id
    note = await db.notes.find_one({"note_id": note_id, "user_id": user_id})
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    return NoteResponse(**note)

@router.put("/{note_id}", response_model=NoteResponse)
async def update_note(
    note_id: str,
    note_update: NoteUpdate,
    request: Request,
    _=Depends(get_user_from_token)
):
    db = await Database.get_db()
    user_id = request.state.user_id
    user = request.state.user
    

    existing_note = await db.notes.find_one({"note_id": note_id, "user_id": user_id})
    if not existing_note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    update_data = note_update.dict(exclude_unset=True)
    update_data.update({
        "last_update": int(time.time()),
        "updated_by": user["user_name"],
        # "updated_by_email": user["user_email"]
    })
    
    await db.notes.update_one(
        {"note_id": note_id, "user_id": user_id},
        {"$set": update_data}
    )
    
    updated_note = await db.notes.find_one({"note_id": note_id})
    return NoteResponse(**updated_note)

@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note(
    note_id: str,
    request: Request,
    _=Depends(get_user_from_token)
):
    db = await Database.get_db()
    user_id = request.state.user_id
    
    result = await db.notes.delete_one({"note_id": note_id, "user_id": user_id})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        ) 