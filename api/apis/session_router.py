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
import logging

logging.basicConfig(level=logging.INFO)

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
    # Log when the route is accessed
    logging.info(f"Signup route accessed for: {user.user_email}")
    
    try:
        # Check for valid MongoDB connection
        try:
            db = await Database.get_db()
        except Exception as e:
            logging.error(f"MongoDB connection error in signup: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Database connection failed: {str(e)}"
            )
        
        # Check if user already exists
        logging.info(f"Checking if user {user.user_email} already exists")
        existing_user = await db.users.find_one({"user_email": user.user_email})
        if existing_user:
            logging.info(f"User {user.user_email} already exists")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        logging.info(f"Creating new user: {user.user_email}")
        current_timestamp = int(time.time())
        user_dict = user.dict()
        user_dict["password"] = get_password_hash(user.password)
        user_dict["user_id"] = str(uuid4())
        user_dict["create_on"] = current_timestamp
        user_dict["last_update"] = current_timestamp
        
        # Insert user with more logging
        try:
            result = await db.users.insert_one(user_dict)
            logging.info(f"User created with ID: {result.inserted_id}")
        except Exception as e:
            logging.error(f"Failed to insert user into database: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database operation failed: {str(e)}"
            )
        
        return UserResponse(**user_dict)
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Log unhandled errors 
        logging.error(f"Unhandled signup error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not create user: {str(e)}"
        )
class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
async def login(request: LoginRequest):
    print(request.email, request.password,"sdfdfas")
    logging.info("login route accessed!",request)
    db = await Database.get_db()
    user = await db.users.find_one({"user_email": request.email})
    
    if not user or not verify_password(request.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    access_token = create_access_token(
        data={"user_id": user["user_id"]},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(**user)
    } 