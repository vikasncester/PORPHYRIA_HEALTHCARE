import Appointments from "./Appointments"
import PatientManagement from "./PatientManagement"
import { useState } from "react";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  const menuItems = [
    { name: "Dashboard", icon: "🏠" },
    { name: "Patients", icon: "👨‍⚕️" },
    { name: "Appointments", icon: "📅" },
    { name: "Reports", icon: "📄" },
    { name: "Symptoms", icon: "🩺" },
    { name: "ML Assessment", icon: "🤖" },
  ];

  const renderContent = () => {
    switch (activePage) {
      case "Patients":
  return <PatientManagement />;

      case "Appointments":
  return <Appointments />;

      case "Reports":
        return (
          <div>
            <h2>Laboratory Reports</h2>
            <p>Upload and manage patient laboratory reports.</p>
            <button className="primary-btn">
              + Upload Report
            </button>
          </div>
        );

      case "Symptoms":
        return (
          <div>
            <h2>Symptoms Management</h2>
            <p>Record and manage patient symptoms.</p>
          </div>
        );

      case "ML Assessment":
        return (
          <div>
            <h2>ML Assessment</h2>
            <p>View prototype risk and subtype assessments.</p>
          </div>
        );

      default:
        return (
          <>
            <h2>Dashboard Overview</h2>
            <p className="subtitle">
              Welcome to your Porphyria Healthcare Dashboard.
            </p>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Patients</h3>
                <h1>0</h1>
                <p>Registered patients</p>
              </div>

              <div className="stat-card">
                <h3>Appointments</h3>
                <h1>0</h1>
                <p>Scheduled appointments</p>
              </div>

              <div className="stat-card">
                <h3>Laboratory Reports</h3>
                <h1>0</h1>
                <p>Uploaded reports</p>
              </div>

              <div className="stat-card">
                <h3>Pending Reviews</h3>
                <h1>0</h1>
                <p>Awaiting doctor review</p>
              </div>
            </div>

            <div className="welcome-card">
              <h2>Welcome to Porphyria Healthcare</h2>
              <p>
                Manage patient records, symptoms, laboratory reports
                and clinical reviews from one place.
              </p>
            </div>
          </>
        );
    }
  };

  return (
    <div className="app-container">

      <aside className="sidebar">
        <div className="logo">
          <h2>Porphyria</h2>
          <span>Healthcare System</span>
        </div>

        <p className="menu-title">MAIN MENU</p>

        <nav>
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={
                activePage === item.name
                  ? "menu-item active"
                  : "menu-item"
              }
              onClick={() => setActivePage(item.name)}
            >
              <span>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          Academic Project
        </div>
      </aside>

      <main className="main-content">

        <header className="topbar">
          <h2>{activePage}</h2>

          <div className="profile">
            <span>Healthcare Manager</span>
            <div className="avatar">H</div>
          </div>
        </header>

        <section className="content-area">
          {renderContent()}
        </section>

        <footer>
          Porphyria Healthcare | Academic Project
        </footer>

      </main>
    </div>
  );
}

export default App;
