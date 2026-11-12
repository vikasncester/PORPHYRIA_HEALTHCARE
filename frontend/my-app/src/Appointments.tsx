
import React, { useState } from "react";
import "./Appointments.css";

type Appointment = {
  id: number;
  patientName: string;
  patientId: string;
  doctor: string;
  date: string;
  time: string;
  reason: string;
  status: "Scheduled" | "Completed" | "Cancelled";
};

const initialAppointments: Appointment[] = [];

const patientOptions = [
  { id: "P001", name: "Demo Patient 1" },
  { id: "P002", name: "Demo Patient 2" },
];

const doctorOptions = [
  "Dr. Sharma",
  "Dr. Priya",
  "Dr. Kumar",
];

const emptyForm = {
  patientId: "",
  doctor: "",
  date: "",
  time: "",
  reason: "",
  status: "Scheduled" as Appointment["status"],
};

const Appointments: React.FC = () => {
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [viewAppointment, setViewAppointment] =
    useState<Appointment | null>(null);

  const selectedPatient = patientOptions.find(
    (patient) => patient.id === form.patientId
  );

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedPatient) {
      alert("Please select a patient.");
      return;
    }

    const appointmentData: Appointment = {
      id: editingId ?? Date.now(),
      patientName: selectedPatient.name,
      patientId: selectedPatient.id,
      doctor: form.doctor,
      date: form.date,
      time: form.time,
      reason: form.reason,
      status: form.status,
    };

    if (editingId !== null) {
      setAppointments((previous) =>
        previous.map((appointment) =>
          appointment.id === editingId
            ? appointmentData
            : appointment
        )
      );
      alert("Appointment updated successfully.");
    } else {
      setAppointments((previous) => [
        appointmentData,
        ...previous,
      ]);
      alert("Appointment added successfully.");
    }

    resetForm();
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingId(appointment.id);

    setForm({
      patientId: appointment.patientId,
      doctor: appointment.doctor,
      date: appointment.date,
      time: appointment.time,
      reason: appointment.reason,
      status: appointment.status,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this appointment?"
    );

    if (confirmed) {
      setAppointments((previous) =>
        previous.filter((appointment) => appointment.id !== id)
      );
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const query = search.toLowerCase();

    return (
      appointment.patientName.toLowerCase().includes(query) ||
      appointment.patientId.toLowerCase().includes(query) ||
      appointment.doctor.toLowerCase().includes(query) ||
      appointment.status.toLowerCase().includes(query)
    );
  });

  return (
    <div className="appointment-container">
      <div className="appointment-header">
        <div>
          <h1>Appointment Management</h1>
          <p>Schedule and manage patient appointments</p>
        </div>
      </div>

      <section className="appointment-card">
        <h2>
          {editingId !== null
            ? "Edit Appointment"
            : "Book New Appointment"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="appointment-form-grid">
            <div className="appointment-field">
              <label>Select Patient *</label>
              <select
                name="patientId"
                value={form.patientId}
                onChange={handleChange}
                required
              >
                <option value="">Choose Patient</option>
                {patientOptions.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} ({patient.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="appointment-field">
              <label>Select Doctor *</label>
              <select
                name="doctor"
                value={form.doctor}
                onChange={handleChange}
                required
              >
                <option value="">Choose Doctor</option>
                {doctorOptions.map((doctor) => (
                  <option key={doctor} value={doctor}>
                    {doctor}
                  </option>
                ))}
              </select>
            </div>

            <div className="appointment-field">
              <label>Appointment Date *</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                min={new Date().toLocaleDateString("en-CA")}
                required
              />
            </div>

            <div className="appointment-field">
              <label>Appointment Time *</label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                required
              />
            </div>

            <div className="appointment-field">
              <label>Appointment Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="appointment-field appointment-full-width">
              <label>Reason for Visit *</label>
              <textarea
                name="reason"
                value={form.reason}
                onChange={handleChange}
                placeholder="Enter reason for appointment"
                rows={3}
                required
              />
            </div>
          </div>

          <div className="appointment-form-actions">
            <button type="submit" className="appointment-submit">
              {editingId !== null
                ? "Update Appointment"
                : "Book Appointment"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                className="appointment-cancel"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="appointment-card appointment-records">
        <div className="appointment-records-header">
          <div>
            <h2>Appointment Records</h2>
            <p>
              Total appointments: {appointments.length}
            </p>
          </div>

          <input
            className="appointment-search"
            type="search"
            placeholder="Search appointments..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="appointment-table-wrapper">
          <table className="appointment-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="appointment-empty">
                    No appointments found.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>
                      <strong>{appointment.patientName}</strong>
                      <small>{appointment.patientId}</small>
                    </td>
                    <td>{appointment.doctor}</td>
                    <td>{appointment.date}</td>
                    <td>{appointment.time}</td>
                    <td>
                      <span
                        className={`appointment-status ${appointment.status.toLowerCase()}`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                    <td>
                      <div className="appointment-actions">
                        <button
                          className="appointment-view"
                          onClick={() => setViewAppointment(appointment)}
                          type="button"
                        >
                          View
                        </button>
                        <button
                          className="appointment-edit"
                          onClick={() => handleEdit(appointment)}
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          className="appointment-delete"
                          onClick={() => handleDelete(appointment.id)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {viewAppointment && (
        <div
          className="appointment-modal-overlay"
          onClick={() => setViewAppointment(null)}
        >
          <div
            className="appointment-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>Appointment Details</h2>

            <p><strong>Patient:</strong> {viewAppointment.patientName}</p>
            <p><strong>Patient ID:</strong> {viewAppointment.patientId}</p>
            <p><strong>Doctor:</strong> {viewAppointment.doctor}</p>
            <p><strong>Date:</strong> {viewAppointment.date}</p>
            <p><strong>Time:</strong> {viewAppointment.time}</p>
            <p><strong>Status:</strong> {viewAppointment.status}</p>
            <p><strong>Reason:</strong> {viewAppointment.reason}</p>

            <button
              className="appointment-submit"
              onClick={() => setViewAppointment(null)}
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
