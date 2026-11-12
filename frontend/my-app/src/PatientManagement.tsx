
import React, { useEffect, useState } from "react";
import "./PatientManagement.css";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  medicalHistory: string;
}

const API_URL = "http://127.0.0.1:8000";

const mapPatient = (data: any): Patient => ({
  id: data.patient_id,
  name: data.name,
  age: data.age,
  gender: data.gender,
  phone: data.contact_number,
  email: data.email ?? "",
  medicalHistory: data.medical_history ?? "",
});

const getErrorMessage = async (response: Response) => {
  try {
    const data = await response.json();
    return typeof data.detail === "string"
      ? data.detail
      : JSON.stringify(data.detail ?? data);
  } catch {
    return `Request failed with status ${response.status}`;
  }
};

const PatientManagement: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    medicalHistory: "",
  });

  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] =
    useState<Patient | null>(null);
  const [editingPatient, setEditingPatient] =
    useState<Patient | null>(null);

  // Load patients from FastAPI
  const fetchPatients = async () => {
    try {
      setApiError("");

      const response = await fetch(`${API_URL}/patients/`);

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("The patients API returned an unexpected response.");
      }

      setPatients(data.map(mapPatient));
    } catch (error) {
      console.error("Fetch patients error:", error);
      setApiError(
        error instanceof Error
          ? error.message
          : "Unable to load patients."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  // Register patient in PostgreSQL through FastAPI
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setSaving(true);
      setApiError("");

      const response = await fetch(`${API_URL}/patients/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          age: Number(form.age),
          gender: form.gender,
          contact_number: form.phone.trim(),
          email: form.email.trim() || null,
          medical_history: form.medicalHistory.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      // Reload from the database after successful registration
      await fetchPatients();

      setForm({
        name: "",
        age: "",
        gender: "",
        phone: "",
        email: "",
        medicalHistory: "",
      });

      alert("Patient registered successfully!");
    } catch (error) {
      console.error("Registration error:", error);
      setApiError(
        error instanceof Error
          ? error.message
          : "Patient registration failed."
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete patient from PostgreSQL
  const deletePatient = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this patient?"
    );

    if (!confirmed) return;

    try {
      setApiError("");

      const response = await fetch(
        `${API_URL}/patients/${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      await fetchPatients();
      setSelectedPatient(null);
      setEditingPatient(null);

      alert("Patient deleted successfully!");
    } catch (error) {
      console.error("Delete patient error:", error);
      setApiError(
        error instanceof Error
          ? error.message
          : "Unable to delete patient."
      );
    }
  };

  // Update patient in PostgreSQL
  const updatePatient = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!editingPatient) return;

    try {
      setApiError("");

      const response = await fetch(
        `${API_URL}/patients/${encodeURIComponent(editingPatient.id)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editingPatient.name.trim(),
            age: Number(editingPatient.age),
            gender: editingPatient.gender,
            contact_number: editingPatient.phone.trim(),
            email: editingPatient.email.trim() || null,
            medical_history:
              editingPatient.medicalHistory.trim() || null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      await fetchPatients();
      setEditingPatient(null);

      alert("Patient details updated successfully!");
    } catch (error) {
      console.error("Update patient error:", error);
      setApiError(
        error instanceof Error
          ? error.message
          : "Unable to update patient."
      );
    }
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(search.toLowerCase()) ||
    patient.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="patient-container">
      {apiError && (
        <p style={{ color: "red", marginBottom: "15px" }}>
          {apiError}
        </p>
      )}

      {loading && (
        <p style={{ color: "#173b63" }}>
          Loading patient records...
        </p>
      )}

      <div className="patient-header">
        <div>
          <h2>Patient Management</h2>
          <p>Register and manage patient information.</p>
        </div>

        <div className="patient-count">
          Total Patients: {patients.length}
        </div>
      </div>

      {/* Registration Form */}
      <div className="patient-card">
        <h3>Register New Patient</h3>

        <form onSubmit={handleSubmit}>
          <div className="patient-form-grid">
            <div className="patient-field">
              <label>Patient Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                minLength={2}
              />
            </div>

            <div className="patient-field">
              <label>Age *</label>
              <input
                type="number"
                name="age"
                min="1"
                max="120"
                value={form.age}
                onChange={handleChange}
                required
              />
            </div>

            <div className="patient-field">
              <label>Gender *</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">
                  Prefer not to say
                </option>
              </select>
            </div>

            <div className="patient-field">
              <label>Contact Number *</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                minLength={10}
                maxLength={15}
                required
              />
            </div>

            <div className="patient-field">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="patient-field">
              <label>Medical History</label>
              <textarea
                name="medicalHistory"
                value={form.medicalHistory}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>

          <button
            type="submit"
            className="patient-submit"
            disabled={saving}
          >
            {saving ? "Registering..." : "+ Register Patient"}
          </button>
        </form>
      </div>

      {/* Patient Records */}
      <div className="patient-card">
        <div className="patient-record-header">
          <h3>Patient Records</h3>

          <input
            className="patient-search"
            placeholder="Search by name or patient ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="patient-table-wrapper">
          <table className="patient-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Contact</th>
                <th>Medical History</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.id}</td>
                    <td>{patient.name}</td>
                    <td>{patient.age}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.phone}</td>
                    <td>
                      {patient.medicalHistory || "Not provided"}
                    </td>

                    <td className="patient-actions">
                      <button
                        className="view-btn"
                        type="button"
                        onClick={() => setSelectedPatient(patient)}
                      >
                        View
                      </button>

                      <button
                        className="edit-btn"
                        type="button"
                        onClick={() =>
                          setEditingPatient({ ...patient })
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        type="button"
                        onClick={() => deletePatient(patient.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="patient-empty">
                    {loading
                      ? "Loading patients..."
                      : "No patient records found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Patient Modal */}
      {selectedPatient && (
        <div className="patient-modal">
          <div className="patient-modal-content">
            <h3>Patient Details</h3>

            <p><b>Patient ID:</b> {selectedPatient.id}</p>
            <p><b>Name:</b> {selectedPatient.name}</p>
            <p><b>Age:</b> {selectedPatient.age}</p>
            <p><b>Gender:</b> {selectedPatient.gender}</p>
            <p><b>Contact:</b> {selectedPatient.phone}</p>
            <p><b>Email:</b> {selectedPatient.email || "Not provided"}</p>
            <p>
              <b>Medical History:</b>{" "}
              {selectedPatient.medicalHistory || "Not provided"}
            </p>

            <button
              className="patient-close"
              type="button"
              onClick={() => setSelectedPatient(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Patient Modal */}
      {editingPatient && (
        <div className="patient-modal">
          <div className="patient-modal-content">
            <h3>Edit Patient Details</h3>

            <form onSubmit={updatePatient}>
              <div className="patient-field">
                <label>Name</label>
                <input
                  value={editingPatient.name}
                  onChange={(e) =>
                    setEditingPatient({
                      ...editingPatient,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="patient-field">
                <label>Age</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={editingPatient.age}
                  onChange={(e) =>
                    setEditingPatient({
                      ...editingPatient,
                      age: Number(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div className="patient-field">
                <label>Gender</label>
                <select
                  value={editingPatient.gender}
                  onChange={(e) =>
                    setEditingPatient({
                      ...editingPatient,
                      gender: e.target.value,
                    })
                  }
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">
                    Prefer not to say
                  </option>
                </select>
              </div>

              <div className="patient-field">
                <label>Contact Number</label>
                <input
                  value={editingPatient.phone}
                  onChange={(e) =>
                    setEditingPatient({
                      ...editingPatient,
                      phone: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="patient-field">
                <label>Email</label>
                <input
                  type="email"
                  value={editingPatient.email}
                  onChange={(e) =>
                    setEditingPatient({
                      ...editingPatient,
                      email: e.target.value,
                    })
                  }
                />
              </div>

              <div className="patient-field">
                <label>Medical History</label>
                <textarea
                  value={editingPatient.medicalHistory}
                  onChange={(e) =>
                    setEditingPatient({
                      ...editingPatient,
                      medicalHistory: e.target.value,
                    })
                  }
                />
              </div>

              <button type="submit" className="patient-submit">
                Save Changes
              </button>

              <button
                type="button"
                className="patient-close"
                onClick={() => setEditingPatient(null)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;
