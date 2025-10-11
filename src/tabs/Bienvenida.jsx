// src/pages/Dashboard/Bienvenida.jsx
import React from "react";
import "../styles/Dashboard.css";

const Bienvenida = () => {
  return (
    <div className="bienvenida-container">
      <h2 className="bienvenida-title">🌐 Bienvenido al Sistema de Gestión de Informes de Actividades</h2>
      <p className="bienvenida-subtitle">
        Este sistema ha sido diseñado para optimizar y digitalizar el proceso de elaboración, envío y revisión de informes del personal de honorarios que colabora en la <b>09 Junta Distrital del INE</b>.
      </p>

      <div className="bienvenida-grid">
        <div className="card">
          <h3>📋 Bitácora de actividades</h3>
          <p>Registra tus actividades diarias de forma simple y organizada.</p>
        </div>
        <div className="card">
          <h3>📝 Elaboración de informes</h3>
          <p>Crea y envía tus informes digitales sin necesidad de papel ni impresiones.</p>
        </div>
        <div className="card">
          <h3>✅ Revisión y validación</h3>
          <p>Recibe retroalimentación y validación de manera ágil y transparente.</p>
        </div>
        <div className="card">
          <h3>🔔 Notificaciones</h3>
          <p>Consulta mensajes personalizados y avisos importantes del sistema.</p>
        </div>
        <div className="card">
          <h3>📊 Dashboard</h3>
          <p>Accede a un panel intuitivo con la información más relevante para tu gestión.</p>
        </div>
      </div>

      <br />

      <div className="admin-section">
        <h2>👨‍💼 Funciones adicionales para administradores</h2>
        <div className="bienvenida-grid">
          <div className="card"><h3>👥 Gestión de usuarios y roles</h3></div>
          <div className="card"><h3>📂 Consulta y auditoría de logs del sistema</h3></div>
          <div className="card"><h3>⚙️ Supervisión general de la plataforma</h3></div>
        </div>
      </div>

      <br />

      <div className="objetivos-section">
        <h2>🎯 Objetivos del sistema</h2>
        <div className="bienvenida-grid">
          <div className="card"><h3>✅ Reducir tiempos en la revisión y validación de informes.</h3></div>
          <div className="card"><h3>✅ Disminuir el uso de recursos físicos como papel e impresiones.</h3></div>
          <div className="card"><h3>✅ Ahorrar traslados innecesarios del personal, fortaleciendo la eficiencia y la sustentabilidad.</h3></div>
        </div>
      </div>

      <br />

      <p className="bienvenida-footer">
        ✨ Tu experiencia en la gestión de informes ahora será más rápida, práctica y segura ✨
      </p>
    </div>
  );
};

export default Bienvenida;
