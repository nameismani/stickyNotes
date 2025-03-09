from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from apis.api_router import router
from db.mongodb import init_db, close_db
import logging
import sys
import json

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
    await init_db()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_db()

app.include_router(router)

database_url = os.getenv("DATABASE_URL")

# print(database_url,"sdfdf")
   
@app.get("/")
def read_root():
    logging.info("Root endpoint accessed!")
    return {"message": "Hello, World!"}
    

@app.middleware("http")
async def log_requests(request: Request, call_next):
    mongoUrl = os.getenv("MONGODB_URL")
    logging.info(f"MongoDB URL: {mongoUrl}")
    # Create more useful log data from request
    req_headers = dict(request.headers)
    # Mask sensitive headers
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
        # For POST/PUT requests, try to log the body content
        if request.method in ["POST", "PUT"]:
            try:
                # Read body content - need to save it since it can only be read once
                body_bytes = await request.body()
                
                # If we have body content, try to decode and log it
                if body_bytes:
                    body_str = body_bytes.decode()
                    
                    # Try to parse as JSON for cleaner logging
                    try:
                        body_json = json.loads(body_str)
                        # Mask password if present
                        if "password" in body_json:
                            body_json["password"] = "[MASKED]"
                        logging.info(f"Request body: {json.dumps(body_json, indent=2)}")
                    except json.JSONDecodeError:
                        # Not JSON, log as plain text (truncated if long)
                        if len(body_str) > 1000:
                            logging.info(f"Request body (truncated): {body_str[:1000]}...")
                        else:
                            logging.info(f"Request body: {body_str}")
                    
                    # Create a custom request with the body content put back
                    # This is important because reading the body consumes it
                    async def receive():
                        return {"type": "http.request", "body": body_bytes}
                    
                    request._receive = receive
            except Exception as e:
                logging.error(f"Error reading request body: {str(e)}")
        
        # Continue with the request
        response = await call_next(request)
        
        # Log response status code
        logging.info(f"Response: {response.status_code}")
        
        return response
    except Exception as e:
        logging.error(f"Request failed: {str(e)}", exc_info=True)
        raise

if __name__ == "__main__":
    import uvicorn
    # Get port from environment variables with a default of 8000
    port = int(os.getenv("API_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
