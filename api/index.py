import os
from mangum import Mangum
import logging



try:
    from main import app
    handler = Mangum(app)
except Exception as e:
    logging.error(f"Error importing app: {str(e)}", exc_info=True)
    
    # Create a fallback handler that returns error information
    def handler(event, context):
        return {
            "statusCode": 500,
            "body": f"Server configuration error: {str(e)}",
            "headers": {
                "Content-Type": "text/plain"
            }
        } 