from fastapi import APIRouter
from apis.session_router import router as session_router
from apis.notes_router import router as notes_router

router = APIRouter()

router.include_router(session_router)
router.include_router(notes_router)

@router.get("/api/test-db", tags=["debug"])
async def test_db():
    """Test endpoint to verify database connection"""
    from db.mongodb import get_db
    
    try:
        # Try to connect to the database
        db = await get_db()
        
        # Get database stats to verify connection works
        stats = await db.command("dbstats")
        
        # Try to list collections
        collections = await db.list_collection_names()
        
        return {
            "status": "success",
            "message": "Database connection successful",
            "db_name": db.name,
            "collections": collections,
            "stats": {
                "collections": stats.get("collections", 0),
                "objects": stats.get("objects", 0),
                "storage_size_mb": round(stats.get("storageSize", 0) / (1024 * 1024), 2)
            }
        }
    except Exception as e:
        import traceback
        tb = traceback.format_exc()
        return {
            "status": "error",
            "message": f"Database connection failed: {str(e)}",
            "traceback": tb
        }
