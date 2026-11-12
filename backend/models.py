

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    Date,
    Time,
    ForeignKey,
)
from sqlalchemy.sql import func
from database import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String(30), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False)
    contact_number = Column(String(15), nullable=False)
    email = Column(String(255), nullable=True)
    medical_history = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)

    patient_id = Column(
        String(30),
        ForeignKey("patients.patient_id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    doctor_name = Column(String(100), nullable=False)
    appointment_date = Column(Date, nullable=False)
    appointment_time = Column(Time, nullable=False)
    reason = Column(Text, nullable=False)

    status = Column(
        String(20),
        nullable=False,
        default="Scheduled",
        server_default="Scheduled",
    )

    created_at = Column(DateTime, server_default=func.now())
