# Technology Stack

- FastAPI
- MongoDB
- NextJS
- TypeScript
- TailwindCSS
- Redux
- NextAuth

# Step to run the project

1.Clone the repository
2.Change the folder to client and run the nextjs project
steps to run the nextjs project - npm install - npm run dev
3.Change the folder to api and run the fastapi project
steps to run the fastapi project - Switch to the fastapi-env folder - python -m ensurepip --default-pip to install pip - pip install -r requirements.txt - uvicorn main:app --reload

# Implemented Advanced Features

- Redux with Redux Thunk with Bearer Token Authentication (Fetch, Create Note)
- custom hook useAxios with advanced URL path parameter handling (Registration and Update Note)
- Server Action with NextJS To avoid api call in client side (Delete Note)
- Used Session in server side to get the user details
- 📊 Full TypeScript support

## Features of useAxios

- 🔄 Built-in loading, error, and data state management
- 🛣️ Advanced URL path parameter handling
- 📝 Support for query parameters
- 🔒 Optional authentication integration
- 🔗 Consistent API for all HTTP methods (GET, POST, PUT, DELETE)
- 📊 Full TypeScript support
- 🧩 Compatible with REST API patterns
