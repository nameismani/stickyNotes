from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from typing import Optional
from models.user import UserCreate, UserResponse
from pydantic import BaseModel
from db.mongodb import Database
from utils.auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from uuid import uuid4
import time

router = APIRouter(
    prefix="/api/auth",
    tags=["authentication"]
)


# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# @router.get("/")
# async def get_sessions():
 
#     return [
#         {
#             "id": 1,
#             "title": "Morning Session",
#             "date": "2024-03-20",
#             "duration": 60,
#             "status": "completed"
#         },
#         {
#             "id": 2,
#             "title": "Evening Session",
#             "date": "2024-03-20",
#             "duration": 45,
#             "status": "scheduled"
#         }
#     ]

# @router.get("/{session_id}")
# async def get_session(session_id: int):
#     # Dummy single session data
#     return {
#         "id": session_id,
#         "title": "Morning Session",
#         "date": "2024-03-20",
#         "duration": 60,
#         "status": "completed"
#     }

@router.post("/signup", response_model=UserResponse)
async def signup(user: UserCreate):
    db = await Database.get_db()
    
    # Check if user already exists
    if await db.users.find_one({"user_email": user.user_email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    current_timestamp = int(time.time())
    user_dict = user.dict()
    user_dict["password"] = get_password_hash(user.password)
    user_dict["user_id"] = str(uuid4())
    user_dict["create_on"] = current_timestamp
    user_dict["last_update"] = current_timestamp
    
    await db.users.insert_one(user_dict)
    
    return UserResponse(**user_dict)
class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
async def login(request: LoginRequest):
    print(request.email, request.password,"sdfdfas")
    db = await Database.get_db()
    user = await db.users.find_one({"user_email": request.email})
    
    if not user or not verify_password(request.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    # Use user_id instead of email in token
    access_token = create_access_token(
        data={"user_id": user["user_id"]},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(**user)
    } 