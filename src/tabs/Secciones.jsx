//src/tabs/Secciones.jsx
import React, { useEffect, useState } from "react";
import "../styles/Secciones.css";
import { FaSpinner, FaEdit } from "react-icons/fa";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Pagination from "../components/Pagination";
import { useSeccion } from "../hooks/useSeccion"; // 🔹 Nuevo hook

const Secciones = () => {
  const {
    secciones,
    aniosZore,
    asignacionesPorAnio,       // ✅ nuevo
    municipios,
    localidades,
    setLocalidades,
    cargarLocalidadesPorMunicipio,
    loading,
    error,
    page,
    setPage,
    totalPages,
    cargarSecciones,
    crearSeccion,
    actualizarSeccion,
    cargarAsignacionesPorAnio, // ✅ nuevo
  } = useSeccion();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSeccion, setSelectedSeccion] = useState(null);
  const [newSeccion, setNewSeccion] = useState({
    numeroSeccion: "",
    anio: "",
    asignacionZoreAreId: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalMessageType, setModalMessageType] = useState("");
  const [tableMessage, setTableMessage] = useState("");
  const [tableMessageType, setTableMessageType] = useState("");
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  useEffect(() => {
    cargarSecciones(page);
  }, [page, cargarSecciones]);

  const showMessage = (msg, type, context = "form") => {
    const setters = {
      form: [setMessage, setMessageType],
      modal: [setModalMessage, setModalMessageType],
      table: [setTableMessage, setTableMessageType],
    };
    const [setMsg, setType] = setters[context];
    setMsg(msg);
    setType(type);

    const duration = type === "success" ? 5000 : 10000;
    setTimeout(() => {
      setMsg("");
    }, duration);

    // 🔹 Si es mensaje de éxito dentro del modal, cerrar después de 6 s (5 + 1)
    if (context === "modal" && type === "success") {
      setTimeout(() => {
        handleCloseModal();
      }, 6000);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const selectElement = document.querySelector(".multi-select");
      if (selectElement && !selectElement.contains(event.target)) {
        setNewSeccion(prev => ({
          ...prev,
          showLocalidadesDropdown: false,
        }));
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const validarSeccion = ({ numeroSeccion, anio, asignacionZoreAreId, municipioId, localidadesSeleccionadas }) => {
    if (!numeroSeccion.trim()) return "El número de sección no puede estar vacío";
    if (!/^\d+$/.test(numeroSeccion.trim()))
      return "El número de sección solo puede contener números";
    if (!anio.trim()) return "El año no puede estar vacío";
    if (!/^\d{4}$/.test(anio.trim()))
      return "El año debe tener formato numérico de 4 dígitos";
    if (!asignacionZoreAreId)
      return "Debe seleccionar una asignación Zore-Are";
    if (!municipioId)
      return "Debe seleccionar un municipio antes de guardar la sección";
    if (!localidadesSeleccionadas?.length)
      return "Debe seleccionar al menos una localidad";
    return null;
  };

  const validarEdicion = ({ numeroSeccion, anio, asignacionZoreAreId, municipioId, localidadesSeleccionadas }) => {
    if (!numeroSeccion.trim()) return "El número de sección no puede estar vacío";
    if (!/^\d+$/.test(numeroSeccion.trim())) return "El número de sección solo puede contener números";
    if (!anio.trim()) return "El año no puede estar vacío";
    if (!/^\d{4}$/.test(anio.trim())) return "El año debe tener formato numérico de 4 dígitos";
    if (!asignacionZoreAreId) return "Debe seleccionar una asignación Zore-Are";
    if (!municipioId) return "Debe seleccionar un municipio";
    if (!localidadesSeleccionadas?.length) return "Debe seleccionar al menos una localidad";
    return null;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoadingCreate(true);
    showMessage("Procesando...", "info");

    const errorMsg = validarSeccion(newSeccion);
    if (errorMsg) {
      showMessage(errorMsg, "error");
      setLoadingCreate(false);
      return;
    }

    const dto = {
      numeroSeccion: newSeccion.numeroSeccion,
      anio: newSeccion.anio,
      asignacionZoreAreId: Number(newSeccion.asignacionZoreAreId),
      localidadesIds: newSeccion.localidadesSeleccionadas || []
    };

    const res = await crearSeccion(dto);
    if (res.success) {
      showMessage(res.message, "success");
      setNewSeccion({
        numeroSeccion: "",
        anio: "",
        asignacionZoreAreId: "",
        municipioId: "",
        localidadesSeleccionadas: [],
        showLocalidadesDropdown: false, // 🔹 cierra el desplegable al guardar
      });
    } else {
      showMessage(res.message, "error");
    }

    setLoadingCreate(false);
  };

  const handleEditClick = async (seccion) => {
    // Cargar las asignaciones del año correspondiente
    await cargarAsignacionesPorAnio(seccion.anio);

    // Cargar las localidades del municipio
    if (seccion.municipio?.id) {
      await cargarLocalidadesPorMunicipio(seccion.municipio.id);
    }

    // Setear la información del registro
    setSelectedSeccion({
      id: seccion.id,
      numeroSeccion: seccion.numeroSeccion,
      anio: seccion.anio,
      asignacionZoreAreId: seccion.asignacionZoreAre.id,
      municipioId: seccion.municipio?.id || "",
      localidadesSeleccionadas: seccion.localidades?.map((l) => l.id) || [],
    });

    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedSeccion(null);
    setModalOpen(false);
    setLocalidades([]); // limpia la lista previa

    // 🔹 Limpia cualquier dropdown abierto de localidades (seguridad extra)
    setNewSeccion(prev => ({ ...prev, showLocalidadesDropdown: false }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    showMessage("Procesando...", "info", "modal");

    const errorMsg = validarEdicion(selectedSeccion);
    if (errorMsg) {
      showMessage(errorMsg, "error", "modal");
      setLoadingUpdate(false);
      return;
    }

    const dto = {
      numeroSeccion: selectedSeccion.numeroSeccion,
      anio: selectedSeccion.anio,
      asignacionZoreAreId: Number(selectedSeccion.asignacionZoreAreId),
      localidadesIds: selectedSeccion.localidadesSeleccionadas || [],
    };

    const res = await actualizarSeccion(selectedSeccion.id, dto);

    if (res.success) {
      showMessage(res.message, "success", "modal");
    } else {
      showMessage(res.message, "error", "modal");
    }

    setLoadingUpdate(false);
  };

  const handlePrevPage = () => page > 0 && setPage((prev) => prev - 1);
  const handleNextPage = () => page < totalPages - 1 && setPage((prev) => prev + 1);

  if (loading) return <p>Cargando secciones...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="secciones-container">
      <h2 className="secciones-title">Lista de Secciones Registradas</h2>

      <div className="secciones-form-table">
        {tableMessage && (
          <div className={`form-message-table-s ${tableMessageType}`}>
            {tableMessage}
          </div>
        )}
        <table className="secciones-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Número</th>
              <th>Año</th>
              <th>Zore</th>
              <th>Are</th>
              <th>Municipio</th>
              <th>Localidades</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
            {secciones.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.numeroSeccion}</td>
                <td>{s.anio}</td>
                <td>{s.asignacionZoreAre.zore.numeracion}</td>
                <td>{s.asignacionZoreAre.are.numeracion}</td>
                <td>{s.municipio?.nombre || "—"}</td>
                <td>{s.localidades?.map((l) => l.nombre).join(", ") || "—"}</td>
                <td className="secciones-action-cell">
                  <button
                    className="secciones-btn-icon edit"
                    onClick={() => handleEditClick(s)}
                  >
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPrev={handlePrevPage}
          onNext={handleNextPage}
        />
      )}

      <h2 className="secciones-title">Registrar Nueva Sección</h2>
      <form className="secciones-form" onSubmit={handleCreate}>
        <div className="secciones-form-group">
          <label>Número de Sección</label>
          <input
                type="text"
                name="numeroSeccion"
                value={newSeccion.numeroSeccion}
                onChange={(e) => {
                const value = e.target.value;
                // Permite solo dígitos y máximo 4 caracteres
                if (/^\d{0,4}$/.test(value)) {
                    setNewSeccion((prev) => ({ ...prev, numeroSeccion: value }));
                }
                }}
                onPaste={(e) => {
                const paste = e.clipboardData.getData("text");
                if (!/^\d{0,4}$/.test(paste)) e.preventDefault();
                }}
                maxLength={4}
                placeholder="Ej. 1299"
                required
          />
        </div>

        <div className="secciones-form-group">
            <label>Año</label>
            <select
                name="anio"
                value={newSeccion.anio}
                onChange={(e) => {
                    const value = e.target.value;

                    // ✅ 1. Actualiza el año
                    // ✅ 2. Limpia los campos dependientes
                    setNewSeccion((prev) => ({
                    ...prev,
                    anio: value,
                    asignacionZoreAreId: "",   // limpiar asignación anterior
                    municipioId: "",           // limpiar municipio
                    localidadesSeleccionadas: [], // limpiar localidades si las usas después
                    }));

                    // ✅ 3. Si se selecciona un año válido, cargar las asignaciones correspondientes
                    if (value) {
                    cargarAsignacionesPorAnio(value);
                    }
                }}
                required
            >
                <option value="">Seleccione un año</option>
                {aniosZore.map((s) => (
                <option key={s.id} value={s.anio}>
                    {s.anio}
                </option>
                ))}
            </select>
        </div>

        <div className="secciones-form-group">
          <label>Asignación Zore-Are</label>
          <select
            name="asignacionZoreAreId"
            value={newSeccion.asignacionZoreAreId || ""}
            onChange={(e) => {
              const value = e.target.value;

              if (!value) {
                // 🔹 Si se elige la opción por defecto, limpiar todo lo dependiente
                setNewSeccion((prev) => ({
                  ...prev,
                  asignacionZoreAreId: "",
                  municipioId: "",
                  localidadesSeleccionadas: [],
                  showLocalidadesDropdown: false,
                }));
                setLocalidades([]); // limpiar lista global de localidades
                return;
              }

              // 🔹 Si se selecciona una asignación válida
              setNewSeccion((prev) => ({
                ...prev,
                asignacionZoreAreId: value,
                municipioId: "",
                localidadesSeleccionadas: [],
                showLocalidadesDropdown: false,
              }));
              setLocalidades([]); // limpiar localidades previas
            }}
            disabled={!newSeccion.anio}
            required
          >
            <option value="">
              {!newSeccion.anio
                ? "Seleccione primero un año"
                : asignacionesPorAnio.length > 0
                ? "Seleccione una asignación"
                : "No hay asignaciones disponibles para este año"}
            </option>

            {asignacionesPorAnio.map((a) => (
              <option key={a.id} value={a.id}>
                Zore {a.numeroZore} / Are {a.numeroAre} — ({a.responsableZore} - {a.responsableAre})
              </option>
            ))}
          </select>
        </div>

        <div className="secciones-form-group">
            <label>Municipio</label>
            <select
                name="municipioId"
                value={newSeccion.municipioId || ""}
                onChange={async (e) => {
                    const municipioId = e.target.value;
                    setNewSeccion((prev) => ({
                    ...prev,
                    municipioId,
                    localidadesSeleccionadas: [], // resetear si cambia municipio
                    }));
                    if (municipioId) {
                      await cargarLocalidadesPorMunicipio(municipioId);
                    } else {
                      setLocalidades([]); // limpia cuando se deselecciona
                    } // ✅ cargar solo las de ese municipio
                }}
                disabled={!newSeccion.asignacionZoreAreId}
                required
            >
                <option value="">
                {!newSeccion.asignacionZoreAreId
                    ? "Seleccione primero una Asignación Zore-Are"
                    : "Seleccione un municipio"}
                </option>
                {municipios.map((m) => (
                <option key={m.id} value={m.id}>
                    {m.nombre}
                </option>
                ))}
            </select>
        </div>

        {/* Localidades */}
        <div className="secciones-form-group">
          <label>Localidades</label>
          <div
            className={`multi-select ${!newSeccion.municipioId ? "disabled" : ""}`}
          >
            <div
              className="multi-select-selected"
              onClick={() => {
                if (!newSeccion.municipioId) return;
                setNewSeccion(prev => ({
                  ...prev,
                  showLocalidadesDropdown: !prev.showLocalidadesDropdown,
                }));
              }}
            >
              <span>
                {newSeccion.localidadesSeleccionadas?.length
                  ? `${newSeccion.localidadesSeleccionadas.length} localidad(es) seleccionada(s)`
                  : "Seleccione localidades"}
              </span>
              {newSeccion.showLocalidadesDropdown ? (
                <FaChevronUp className="multi-select-icon" />
              ) : (
                <FaChevronDown className="multi-select-icon" />
              )}
            </div>

            {newSeccion.showLocalidadesDropdown && localidades.length > 0 && (
              <div className="multi-select-options">
                {localidades.map(loc => (
                  <label key={loc.id} className="checkbox-item">
                    <input
                      type="checkbox"
                      value={loc.id}
                      checked={newSeccion.localidadesSeleccionadas?.includes(loc.id)}
                      onChange={(e) => {
                        e.stopPropagation(); // ✅ evita que cierre
                        const id = Number(e.target.value);
                        setNewSeccion(prev => ({
                          ...prev,
                          localidadesSeleccionadas: e.target.checked
                            ? [...(prev.localidadesSeleccionadas || []), id]
                            : prev.localidadesSeleccionadas.filter(l => l !== id),
                        }));
                      }}
                    />
                    {loc.nombre}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {message && (
          <div className={`form-message-create-s ${messageType}`}>{message}</div>
        )}

        <button
          type="submit"
          disabled={loadingCreate}
          className="secciones-btn-guardar"
        >
          {loadingCreate ? (
            <>
              Procesando... <FaSpinner className="spinner" />
            </>
          ) : (
            "Crear Sección"
          )}
        </button>
      </form>

      {modalOpen && selectedSeccion && (
      <div className="secciones-modal">
        <div className="secciones-modal-content">
          <h3 className="secciones-modal-title">Editar Sección</h3>

          <form onSubmit={handleUpdate} className="secciones-modal-form">
            <div className="secciones-modal-form-group">
              <label>Número de Sección</label>
              <input
                type="text"
                value={selectedSeccion.numeroSeccion}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,4}$/.test(value)) {
                    setSelectedSeccion((prev) => ({
                      ...prev,
                      numeroSeccion: value,
                    }));
                  }
                }}
                onPaste={(e) => {
                  const paste = e.clipboardData.getData("text");
                  if (!/^\d{0,4}$/.test(paste)) e.preventDefault();
                }}
                maxLength={4}
                placeholder="Ej. 1299"
                required
              />
            </div>

            <div className="secciones-modal-form-group">
              <label>Año</label>
              <select
                name="anio"
                value={selectedSeccion.anio}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedSeccion((prev) => ({
                    ...prev,
                    anio: value,
                    asignacionZoreAreId: "",
                    municipioId: "",
                    localidadesSeleccionadas: [],
                    showLocalidadesDropdown: false,
                  }));
                  if (value) cargarAsignacionesPorAnio(value);
                }}
                required
              >
                <option value="">Seleccione un año</option>
                {aniosZore.map((a) => (
                  <option key={a.id} value={a.anio}>
                    {a.anio}
                  </option>
                ))}
              </select>
            </div>

            <div className="secciones-modal-form-group">
              <label>Asignación Zore-Are</label>
              <select
                name="asignacionZoreAreId"
                value={selectedSeccion.asignacionZoreAreId || ""}
                onChange={(e) => {
                  const value = e.target.value;

                  if (!value) {
                    setSelectedSeccion((prev) => ({
                      ...prev,
                      asignacionZoreAreId: "",
                      municipioId: "",
                      localidadesSeleccionadas: [],
                      showLocalidadesDropdown: false,
                    }));
                    setLocalidades([]);
                    return;
                  }

                  setSelectedSeccion((prev) => ({
                    ...prev,
                    asignacionZoreAreId: value,
                    municipioId: "",
                    localidadesSeleccionadas: [],
                    showLocalidadesDropdown: false,
                  }));
                  setLocalidades([]);
                }}
                disabled={!selectedSeccion.anio}
                required
              >
                <option value="">
                  {!selectedSeccion.anio
                    ? "Seleccione primero un año"
                    : asignacionesPorAnio.length > 0
                    ? "Seleccione una asignación"
                    : "No hay asignaciones disponibles para este año"}
                </option>

                {asignacionesPorAnio.map((a) => (
                  <option key={a.id} value={a.id}>
                    Zore {a.numeroZore} / Are {a.numeroAre} — ({a.responsableZore} -{" "}
                    {a.responsableAre})
                  </option>
                ))}
              </select>
            </div>

            <div className="secciones-modal-form-group">
              <label>Municipio</label>
              <select
                name="municipioId"
                value={selectedSeccion.municipioId || ""}
                onChange={async (e) => {
                  const municipioId = e.target.value;
                  setSelectedSeccion((prev) => ({
                    ...prev,
                    municipioId,
                    localidadesSeleccionadas: [],
                  }));
                  if (municipioId) {
                    await cargarLocalidadesPorMunicipio(municipioId);
                  } else {
                    setLocalidades([]);
                  }
                }}
                disabled={!selectedSeccion.asignacionZoreAreId}
                required
              >
                <option value="">
                  {!selectedSeccion.asignacionZoreAreId
                    ? "Seleccione primero una Asignación Zore-Are"
                    : "Seleccione un municipio"}
                </option>
                {municipios.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="secciones-modal-form-group">
              <label>Localidades</label>
              <div
                className={`multi-select ${
                  !selectedSeccion.municipioId ? "disabled" : ""
                }`}
              >
                <div
                  className="multi-select-selected"
                  onClick={() => {
                    if (!selectedSeccion.municipioId) return;
                    setSelectedSeccion((prev) => ({
                      ...prev,
                      showLocalidadesDropdown: !prev.showLocalidadesDropdown,
                    }));
                  }}
                >
                  <span>
                    {selectedSeccion.localidadesSeleccionadas?.length
                      ? `${selectedSeccion.localidadesSeleccionadas.length} localidad(es) seleccionada(s)`
                      : "Seleccione localidades"}
                  </span>
                  {selectedSeccion.showLocalidadesDropdown ? (
                    <FaChevronUp className="multi-select-icon" />
                  ) : (
                    <FaChevronDown className="multi-select-icon" />
                  )}
                </div>

                {selectedSeccion.showLocalidadesDropdown &&
                  localidades.length > 0 && (
                    <div className="multi-select-options">
                      {localidades.map((loc) => (
                        <label key={loc.id} className="checkbox-item">
                          <input
                            type="checkbox"
                            value={loc.id}
                            checked={selectedSeccion.localidadesSeleccionadas?.includes(
                              loc.id
                            )}
                            onChange={(e) => {
                              e.stopPropagation();
                              const id = Number(e.target.value);
                              setSelectedSeccion((prev) => ({
                                ...prev,
                                localidadesSeleccionadas: e.target.checked
                                  ? [...(prev.localidadesSeleccionadas || []), id]
                                  : prev.localidadesSeleccionadas.filter(
                                      (l) => l !== id
                                    ),
                              }));
                            }}
                          />
                          {loc.nombre}
                        </label>
                      ))}
                    </div>
                  )}
              </div>
            </div>

            {modalMessage && (
              <div className={`form-message-modal-s ${modalMessageType}`}>
                {modalMessage}
              </div>
            )}

            <div className="secciones-modal-buttons">
              <button
                type="submit"
                disabled={loadingUpdate}
                className="btn-guardar"
              >
                {loadingUpdate ? (
                  <>
                    <FaSpinner className="spinner" /> Procesando...
                  </>
                ) : (
                  "Actualizar"
                )}
              </button>
              <button
                type="button"
                onClick={handleCloseModal}
                className="btn-cancelar"
              >
                Cerrar
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </div>
  );
};

export default Secciones;
