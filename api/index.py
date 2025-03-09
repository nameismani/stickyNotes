from mangum import Mangum
from main import app

# This is the handler that Vercel will use
handler = Mangum(app) 