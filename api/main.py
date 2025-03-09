import sys
import logging
import json
import os
import asyncio
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from apis.api_router import router
from db.mongodb import init_db, close_db

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)

# Load environment variables first
dotenv_path = os.path.join(os.path.dirname(__file__), "..", ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

app = FastAPI(
    title="Notes API",
    description="API for user authentication and notes",
    version="1.0.0"
)

# Add this for Vercel environment
async def check_event_loop():
    """Ensure we have a running event loop for serverless environment"""
    try:
        loop = asyncio.get_event_loop()
        if loop.is_closed():
            logging.warning("Event loop was closed, creating new one")
            asyncio.set_event_loop(asyncio.new_event_loop())
    except RuntimeError:
        logging.warning("No event loop found, creating new one")
        asyncio.set_event_loop(asyncio.new_event_loop())

origins = [
    # "http://localhost:3000",  
    # "https://yourdomain.com",  
    "*",
    # we can also allow all origins by using "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True, 
    allow_methods=["GET", "POST", "PUT", "DELETE"], 
    allow_headers=["*"],  
)

@app.on_event("startup")
async def startup_db_client():
    try:
        # Ensure event loop is available
        await check_event_loop()
        
        # Log environment variables (excluding secrets)
        env_vars = {k: v if not any(secret in k.lower() for secret in ["key", "secret", "token", "password"]) else "[MASKED]" 
                   for k, v in os.environ.items()}
        logging.info(f"Environment variables: {env_vars}")
        
        # Check MongoDB URL
        mongodb_url = os.getenv("MONGODB_URL")
        if not mongodb_url:
            logging.error("MONGODB_URL environment variable is not set!")
        else:
            logging.info(f"MONGODB_URL is set: {mongodb_url[:20]}...")
        
        # Initialize database connection
        await init_db()
        logging.info("Database initialized successfully")
    except Exception as e:
        logging.error(f"Failed to initialize database: {str(e)}")

@app.on_event("shutdown")
async def shutdown_db_client():
    try:
        await close_db()
    except Exception as e:
        logging.error(f"Error closing DB connection: {str(e)}")

app.include_router(router)

database_url = os.getenv("DATABASE_URL")

# print(database_url,"sdfdf")
   
@app.get("/")
async def read_root():
    # Ensure event loop is available
    await check_event_loop()
    logging.info("Root endpoint accessed!")
    return {"message": "Hello, World!"}
    

@app.middleware("http")
async def log_requests(request: Request, call_next):
    # Ensure event loop is available for each request
    await check_event_loop()
    
    # Get MongoDB URL (log it securely)
    mongoUrl = os.getenv("MONGODB_URL", "Not set")
    masked_url = f"{mongoUrl[:15]}..." if len(mongoUrl) > 15 else "Not set properly"
    logging.info(f"MongoDB URL: {masked_url}")
    
    # Create log data from request
    req_headers = dict(request.headers)
    if "authorization" in req_headers:
        req_headers["authorization"] = "Bearer [MASKED]"
    if "cookie" in req_headers:
        req_headers["cookie"] = "[MASKED]"
        
    request_info = {
        "method": request.method,
        "url": str(request.url),
        "path": request.url.path,
        "query_params": dict(request.query_params),
        "headers": req_headers,
        "client": request.client.host if request.client else "unknown"
    }
    
    # Log structured request data
    logging.info(f"Request: {json.dumps(request_info, indent=2)}")
    
    try:
        # For POST/PUT requests, log the body
        if request.method in ["POST", "PUT"]:
            try:
                body_bytes = await request.body()
                
                if body_bytes:
                    body_str = body_bytes.decode()
                    
                    try:
                        body_json = json.loads(body_str)
                        if "password" in body_json:
                            body_json["password"] = "[MASKED]"
                        logging.info(f"Request body: {json.dumps(body_json, indent=2)}")
                    except json.JSONDecodeError:
                        if len(body_str) > 1000:
                            logging.info(f"Request body (truncated): {body_str[:1000]}...")
                        else:
                            logging.info(f"Request body: {body_str}")
                    
                    # Put body back for further processing
                    async def receive():
                        return {"type": "http.request", "body": body_bytes}
                    
                    request._receive = receive
            except Exception as e:
                logging.error(f"Error reading request body: {str(e)}")
        
        # Process the request
        try:
            response = await call_next(request)
            logging.info(f"Response: {response.status_code}")
            return response
        except Exception as e:
            logging.error(f"Request processing failed: {str(e)}", exc_info=True)
            raise
            
    except Exception as e:
        logging.error(f"Request middleware error: {str(e)}", exc_info=True)
        raise

# This is required by Vercel
from mangum import Mangum
handler = Mangum(app)

if __name__ == "__main__":
    import uvicorn
    # Get port from environment variables with a default of 8000
    port = int(os.getenv("API_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
