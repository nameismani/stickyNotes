from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure

# Connection string should be set as an environment variable in Vercel
MONGODB_URL = os.getenv("MONGODB_URL")
DB_NAME = "notes_app"  # Default database name

# Store the client at module level
_client = None
_db = None

async def ensure_event_loop():
    """Make sure we have a working event loop for async operations"""
    try:
        loop = asyncio.get_event_loop()
        if loop.is_closed():
            logging.warning("Event loop was closed in db module, creating new one")
            asyncio.set_event_loop(asyncio.new_event_loop())
    except RuntimeError:
        logging.warning("No event loop found in db module, creating new one")
        asyncio.set_event_loop(asyncio.new_event_loop())

async def init_db():
    """Initialize the database connection"""
    global _client, _db
    
    # Ensure we have a working event loop
    await ensure_event_loop()
    
    if not MONGODB_URL:
        logging.error("MONGODB_URL environment variable is not set!")
        raise ValueError("MONGODB_URL environment variable is not set")
    
    try:
        logging.info(f"Connecting to MongoDB at {MONGODB_URL[:20]}...")
        
        # Create client with serverless-friendly settings
        _client = AsyncIOMotorClient(
            MONGODB_URL,
            serverSelectionTimeoutMS=5000,  # 5 second timeout
            connectTimeoutMS=10000,
            socketTimeoutMS=45000,
            maxPoolSize=10,
            minPoolSize=0,
            maxIdleTimeMS=50000,
            retryWrites=True,  # Important for serverless
        )
        
        # Test connection with a short timeout
        await asyncio.wait_for(_client.admin.command('ismaster'), timeout=5.0)
        logging.info("MongoDB connection established successfully")
        
        # Get database
        _db = _client[DB_NAME]
        logging.info(f"Using database: {DB_NAME}")
        
        return _db
    except asyncio.TimeoutError:
        logging.error("MongoDB connection timed out")
        _client = None
        _db = None
        raise
    except (ServerSelectionTimeoutError, ConnectionFailure) as e:
        logging.error(f"Failed to connect to MongoDB: {str(e)}")
        _client = None
        _db = None
        raise

async def close_db():
    """Close the database connection"""
    global _client
    if _client:
        logging.info("Closing MongoDB connection")
        _client.close()
        _client = None

async def get_db():
    """Get database instance, initializing it if needed"""
    global _client, _db
    
    # Ensure we have a working event loop
    await ensure_event_loop()
    
    if _client is None or _db is None:
        try:
            logging.info("Database connection not initialized, connecting now")
            await init_db()
        except Exception as e:
            logging.error(f"Error connecting to database: {str(e)}")
            raise
    
    return _db

# For backward compatibility with existing code
class Database:
    @classmethod
    async def connect_db(cls):
        await init_db()
    
    @classmethod
    async def close_db(cls):
        await close_db()
    
    @classmethod
    async def get_db(cls):
        return await get_db() 