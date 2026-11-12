
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Appointment, Patient
from schemas import (
    AppointmentCreate,
    AppointmentUpdate,
    AppointmentResponse,
)

router = APIRouter(
    prefix="/appointments",
    tags=["Appointments"]
)


# CREATE APPOINTMENT
@router.post("/", response_model=AppointmentResponse)
def create_appointment(
    appointment: AppointmentCreate,
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(
        Patient.patient_id == appointment.patient_id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found. Register the patient first."
        )

    new_appointment = Appointment(
        patient_id=appointment.patient_id,
        doctor_name=appointment.doctor_name,
        appointment_date=appointment.appointment_date,
        appointment_time=appointment.appointment_time,
        reason=appointment.reason,
        status=appointment.status,
    )

    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)

    return new_appointment


# GET ALL APPOINTMENTS
@router.get("/", response_model=list[AppointmentResponse])
def get_appointments(db: Session = Depends(get_db)):
    return db.query(Appointment).order_by(
        Appointment.appointment_date,
        Appointment.appointment_time
    ).all()


# GET ONE APPOINTMENT
@router.get("/{appointment_id}", response_model=AppointmentResponse)
def get_appointment(
    appointment_id: int,
    db: Session = Depends(get_db)
):
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id
    ).first()

    if not appointment:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found."
        )

    return appointment


# UPDATE APPOINTMENT
@router.put("/{appointment_id}", response_model=AppointmentResponse)
def update_appointment(
    appointment_id: int,
    updated_data: AppointmentUpdate,
    db: Session = Depends(get_db)
):
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id
    ).first()

    if not appointment:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found."
        )

    patient = db.query(Patient).filter(
        Patient.patient_id == updated_data.patient_id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found."
        )

    appointment.patient_id = updated_data.patient_id
    appointment.doctor_name = updated_data.doctor_name
    appointment.appointment_date = updated_data.appointment_date
    appointment.appointment_time = updated_data.appointment_time
    appointment.reason = updated_data.reason
    appointment.status = updated_data.status

    db.commit()
    db.refresh(appointment)

    return appointment


# DELETE APPOINTMENT
@router.delete("/{appointment_id}")
def delete_appointment(
    appointment_id: int,
    db: Session = Depends(get_db)
):
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id
    ).first()

    if not appointment:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found."
        )

    db.delete(appointment)
    db.commit()

    return {
        "message": "Appointment deleted successfully."
    }
