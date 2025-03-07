from fastapi import APIRouter
from apis.session_router import router as session_router
from apis.notes_router import router as notes_router

router = APIRouter()

router.include_router(session_router)
router.include_router(notes_router)
