from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure

# Connection string should be set as an environment variable in Vercel
MONGODB_URL = os.getenv("MONGODB_URL")
DB_NAME = "notes_app"  # Default database name

# Store the client at module level (better for serverless)
_client = None
_db = None

async def init_db():
    """Initialize the database connection"""
    global _client, _db
    
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
        )
        
        # Test connection and validate server is accessible
        await _client.admin.command('ismaster')
        logging.info("MongoDB connection established successfully")
        
        # Get database
        _db = _client[DB_NAME]
        logging.info(f"Using database: {DB_NAME}")
        
        return _db
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
    
    if _client is None or _db is None:
        try:
            logging.info("Database connection not initialized, connecting now")
            await init_db()
        except Exception as e:
            logging.error(f"Error connecting to database: {str(e)}")
            raise
    
    return _db

# For backward compatibility with your current code
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