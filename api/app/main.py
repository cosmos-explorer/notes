from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.database import init_db
from app.routers import users, notes

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(users.router)
app.include_router(notes.router)


@app.on_event("startup")
async def startup():
    await init_db()


@app.get("/")
async def read_root():
    return {"Hello": "World"}
