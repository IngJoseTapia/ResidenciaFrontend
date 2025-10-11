// src/tabs/Vocalias.jsx
import React from "react";
import "../styles/Dashboard.css";

const Vocalias = ({ vocalias, loading, error }) => {
  if (loading) return <p>Cargando vocalías...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="tab-content">
      <h2>Vocalías</h2>
      <table className="tab-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Abreviatura</th>
            <th>Nombre Completo</th>
          </tr>
        </thead>
        <tbody>
          {vocalias.map((v) => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.abreviatura}</td>
              <td>{v.nombreCompleto}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Vocalias;
