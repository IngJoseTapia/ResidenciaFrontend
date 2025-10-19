// src/components/Pagination.jsx
import React from "react";
import "../styles/Pagination.css";

const Pagination = ({ currentPage, totalPages, onPrev, onNext }) => {
  if (totalPages <= 1) return null; // No mostrar si solo hay 1 página

  return (
    <div className="pagination-controls">
      <button onClick={onPrev} disabled={currentPage === 0}>
        Anterior
      </button>

      <span>
        Página {currentPage + 1} de {totalPages}
      </span>

      <button onClick={onNext} disabled={currentPage >= totalPages - 1}>
        Siguiente
      </button>
    </div>
  );
};

export default Pagination;
