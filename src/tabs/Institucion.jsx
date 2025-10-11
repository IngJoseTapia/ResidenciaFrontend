// src/tabs/Institucion.jsx
import React from "react";
import { FaFacebook, FaInstagram, FaGlobe, FaYoutube } from "react-icons/fa";
import "../styles/Dashboard.css";

const Institucion = () => {
  return (
    <div className="institucion-container">
      <h2 className="institucion-title">Acerca del INE</h2>
      <p className="institucion-subtitle">
        El INE es la máxima autoridad electoral del Estado Mexicano, que además de llevar a cabo las elecciones
        federales y emitir la Credencial para Votar, realiza una serie de actividades tanto al interior del instituto
        como para la ciudadanía.
      </p>

      <h2 className="institucion-title">09 Junta Distrital Ejecutiva</h2>
      <h3>¿Qué hacemos?</h3>
      <p className="institucion-subtitle">
        Ejecutar las actividades del Instituto en cada uno de los 300 distritos uninominales electorales, así como
        evaluar el cumplimiento de los programas relativos al Registro Federal de Electores, Organización Electoral y
        Capacitación Electoral y Educación Cívica.
      </p>

      <h3>Ubicación</h3>
      <p className="institucion-subtitle">
        Carretera San Pablo Tlalchichilpa #3, Mza. 5, Lote 3, Col. Ejidal, San Felipe del Progreso, México
      </p>

      <h3>Teléfono</h3>
      <p className="institucion-subtitle">712 283 1523</p>

      <div className="redes-sociales">
        <h2>🌍 Nuestras redes sociales</h2>
        <div className="redes-botones">
          <a
            href="https://www.facebook.com/09JuntaDistritalEdoMex?locale=es_LA"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-red"
          >
            <FaFacebook />
            <span>Facebook</span>
          </a>

          <a
            href="https://www.instagram.com/09juntadistritalejecutivaine/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-red"
          >
            <FaInstagram />
            <span>Instagram</span>
          </a>

          <a
            href="https://youtube.com/@inejd09sanfelipedelprogreso?si=9On-3aAXuxJBqPwE"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-red"
          >
            <FaYoutube />
            <span>YouTube</span>
          </a>

          <a
            href="https://www.ine.mx/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-red"
          >
            <FaGlobe />
            <span>Página Web</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Institucion;
