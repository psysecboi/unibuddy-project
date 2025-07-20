
import React, { useState } from "react";
import StudentDashboard from "./StudentDashboard";
import ProfessorDashboard from "./ProfessorDashboard";

export default function App() {
  const [role, setRole] = useState("");

  if (!role) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Welcome to Unibuddy</h1>
        <button onClick={() => setRole("student")}>I'm a Student</button>
        <button onClick={() => setRole("professor")}>I'm a Professor</button>
      </div>
    );
  }

  return role === "student" ? <StudentDashboard /> : <ProfessorDashboard />;
}
