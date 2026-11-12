
from pydantic import BaseModel, ConfigDict, Field, EmailStr
from typing import Optional, Literal
from datetime import date, time


# =========================
# PATIENT SCHEMAS
# =========================

class PatientCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    age: int = Field(ge=1, le=120)
    gender: str
    contact_number: str = Field(min_length=10, max_length=15)
    email: Optional[EmailStr] = None
    medical_history: Optional[str] = None


class PatientResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    patient_id: str
    name: str
    age: int
    gender: str
    contact_number: str
    email: Optional[str] = None
    medical_history: Optional[str] = None


# =========================
# APPOINTMENT SCHEMAS
# =========================

class AppointmentCreate(BaseModel):
    patient_id: str = Field(min_length=1, max_length=30)
    doctor_name: str = Field(min_length=2, max_length=100)
    appointment_date: date
    appointment_time: time
    reason: str = Field(min_length=2)
    status: str = "Scheduled"
    status: Literal["Scheduled", "Completed", "Cancelled"] = "Scheduled"

class AppointmentUpdate(BaseModel):
    patient_id: str = Field(min_length=1, max_length=30)
    doctor_name: str = Field(min_length=2, max_length=100)
    appointment_date: date
    appointment_time: time
    reason: str = Field(min_length=2)
    status: str
    status: Literal["Scheduled", "Completed", "Cancelled"]


class AppointmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    patient_id: str
    doctor_name: str
    appointment_date: date
    appointment_time: time
    reason: str
    status: str
