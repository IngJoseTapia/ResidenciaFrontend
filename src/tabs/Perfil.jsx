// src/tabs/Perfil.jsx
import React from "react";
import InfoPersonalForm from "../components/InfoPersonalForm";
import PasswordForm from "../components/PasswordForm";
import "../styles/Dashboard.css";

const Perfil = ({ user, updateUserInfo, changePassword }) => {
  return (
    <div className="informacion-container">
      {!user ? (
        <p>Cargando información del usuario...</p>
      ) : (
        <>
          <h2 className="perfil-title">Mi Información</h2>
          <InfoPersonalForm user={user} updateUserInfo={updateUserInfo} />

          <h2 className="perfil-title">Seguridad</h2>
          <PasswordForm user={user} changePassword={changePassword} />
        </>
      )}
    </div>
  );
};

export default Perfil;
