from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import OperationalError
from .database import engine, Base
from .routers import auth, projects, tasks, dashboard

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(tasks.router)
app.include_router(dashboard.router)

@app.on_event("startup")
def _create_tables_on_startup() -> None:
    try:
        Base.metadata.create_all(bind=engine)
    except OperationalError:
        # If the DB isn't reachable yet, don't prevent the API from starting.
        # Requests that require DB access will still fail until the DB is up.
        pass

@app.get("/")
def root():
    return {"message": "Team Task Manager API is running"}