from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer
from utils.auth import get_current_user_id
from db.mongodb import Database
import logging

logging.basicConfig(level=logging.INFO)

security = HTTPBearer()

async def get_user_from_token(request: Request):
    if "authorization" not in request.headers:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing"
        )
    logging.info("middleware accessed!",request.headers)
    try:
        # Get token from header
        auth_header = request.headers["authorization"]
        # print(auth_header,request.headers,"sdfadsf")
        scheme, token = auth_header.split()
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication scheme"
            )
        
        # Validate token and get user_id
        user_id = await get_current_user_id(token)
        
        # Get user details from database
        db = await Database.get_db()
        user = await db.users.find_one({"user_id": user_id})
      
        logging.info("userDetails from token!",user)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        # Add user details to request state
        request.state.user = user
        request.state.user_id = user_id
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        ) 