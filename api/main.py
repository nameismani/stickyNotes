from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from apis.api_router import router
from db.mongodb import init_db, close_db

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
    return {"message": "Hello, World!"}
    

if __name__ == "__main__":
    import uvicorn
    # Get port from environment variables with a default of 8000
    port = int(os.getenv("API_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
