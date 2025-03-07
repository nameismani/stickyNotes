from fastapi import APIRouter

router = APIRouter(
    prefix="/api/notes",
    tags=["notes"]
)

@router.get("/")
async def get_notes():
    # Dummy data for notes
    return [
        {
            "id": 1,
            "title": "Meeting Notes",
            "content": "Discussion about new features",
            "created_at": "2024-03-20T10:00:00Z"
        },
        {
            "id": 2,
            "title": "Project Ideas",
            "content": "List of potential improvements",
            "created_at": "2024-03-20T11:00:00Z"
        }
    ]

@router.get("/{note_id}")
async def get_note(note_id: int):
    # Dummy single note data
    return {
        "id": note_id,
        "title": "Meeting Notes",
        "content": "Discussion about new features",
        "created_at": "2024-03-20T10:00:00Z"
    } 