
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Patient
from schemas import PatientCreate, PatientResponse

router = APIRouter(
    prefix="/patients",
    tags=["Patients"]
)


@router.post("/", response_model=PatientResponse)
def create_patient(
    patient: PatientCreate,
    db: Session = Depends(get_db)
):
    try:
        new_patient = Patient(
            patient_id=f"PAT{uuid4().hex[:10].upper()}",
            name=patient.name,
            age=patient.age,
            gender=patient.gender,
            contact_number=patient.contact_number,
            email=str(patient.email) if patient.email else None,
            medical_history=patient.medical_history
        )

        db.add(new_patient)
        db.commit()
        db.refresh(new_patient)

        return new_patient

    except Exception:
        db.rollback()
        raise


@router.get("/", response_model=list[PatientResponse])
def get_patients(db: Session = Depends(get_db)):
    return (
        db.query(Patient)
        .order_by(Patient.id.desc())
        .all()
    )


@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(
    patient_id: str,
    db: Session = Depends(get_db)
):
    patient = (
        db.query(Patient)
        .filter(Patient.patient_id == patient_id)
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    return patient


@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(
    patient_id: str,
    updated_data: PatientCreate,
    db: Session = Depends(get_db)
):
    patient = (
        db.query(Patient)
        .filter(Patient.patient_id == patient_id)
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    patient.name = updated_data.name
    patient.age = updated_data.age
    patient.gender = updated_data.gender
    patient.contact_number = updated_data.contact_number
    patient.email = (
        str(updated_data.email)
        if updated_data.email
        else None
    )
    patient.medical_history = updated_data.medical_history

    try:
        db.commit()
        db.refresh(patient)
        return patient

    except Exception:
        db.rollback()
        raise


@router.delete("/{patient_id}")
def delete_patient(
    patient_id: str,
    db: Session = Depends(get_db)
):
    patient = (
        db.query(Patient)
        .filter(Patient.patient_id == patient_id)
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    try:
        db.delete(patient)
        db.commit()

        return {
            "message": "Patient deleted successfully"
        }

    except Exception:
        db.rollback()
        raise

