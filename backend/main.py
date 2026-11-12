
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
import models
from routers import patients, Appointments

app = FastAPI(
    title="Porphyria Healthcare API",
    description="Backend API for Porphyria Healthcare Management",
    version="1.0.0"
)

# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)

app.include_router(patients.router)
app.include_router(Appointments.router)

@app.get("/")
def home():
    return {
        "message": "Porphyria Healthcare Backend is running!"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }
