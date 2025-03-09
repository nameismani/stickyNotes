from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
import os
from datetime import datetime
from uuid import uuid4

class Database:
    client: AsyncIOMotorClient = None
    
    @classmethod
    async def connect_db(cls):
        cls.client = AsyncIOMotorClient(os.getenv("MONGODB_URL"))
        
    @classmethod
    async def close_db(cls):
        if cls.client is not None:
            cls.client.close()
            
    @classmethod
    async def get_db(cls):
        return cls.client.notes_app

async def init_db():
    await Database.connect_db()

async def close_db():
    await Database.close_db() 