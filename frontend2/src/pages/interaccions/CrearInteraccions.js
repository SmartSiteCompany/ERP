import React, { useState, useEffect } from "react";
import Layout from "../../layouts/pages/layout";
import { useNavigate } from "react-router-dom";
import AlertComponent from "../../components/AlertasComponent";
import InteraccionService from "../../services/InteraccionService";
import ClienteService from "../../services/ClienteService";

// Opciones predefinidas para los selects
const TIPO_INTERACCION_OPTIONS = [
  { value: "llamada", label: "Llamada" },
  { value: "correo", label: "Correo Electrónico" },
  { value: "reunión", label: "Reunión" },
  { value: "visita", label: "Visita" }
];

const ESTADO_OPTIONS = [
  { value: "pendiente", label: "Pendiente" },
  { value: "completada", label: "Completada" },
  { value: "cancelada", label: "Cancelada" }
];

const CrearInteraccion = ({ onInteraccionCreada }) => {
  const navigate = useNavigate();
  const { crearInteraccion } = InteraccionService();
  const { obtenerClientes } = ClienteService();

  // Estado del formulario
  const [formData, setFormData] = useState({
    cliente_id: "",
    tipo_interaccion: "llamada",
    descripcion: "",
    fecha: new Date().toISOString().split('T')[0],
    hora: "12:00",
    responsable: "",
    estado: "pendiente"
  });

  const [clientes, setClientes] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Obtener clientes al montar el componente
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setIsLoading(true);
        const fetchedClientes = await obtenerClientes();
        setClientes(fetchedClientes);
      } catch (err) {
        console.error("Error al obtener clientes:", err);
        setAlertType("error");
        setAlertMessage("Error al cargar los clientes");
        setShowAlert(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClientes();
  }, [obtenerClientes]);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const fechaCompleta = `${formData.fecha}T${formData.hora}:00.000Z`;
      
      await crearInteraccion({
        ...formData,
        fecha: fechaCompleta
      });
      
      setAlertType("success");
      setAlertMessage("Interacción creada exitosamente.");
      setShowAlert(true);
      
      // Redirigir después de 2 segundos
      setTimeout(() => navigate('/ListaInteraccions'), 2000);
      
      if (onInteraccionCreada) {
        onInteraccionCreada(formData);
      }
    } catch (error) {
      console.error("Error al crear la interacción:", error);
      setAlertType("error");
      setAlertMessage("Error al crear la interacción");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <h2 className="float-left font-size-h4">Nueva Interacción</h2>
              <div className="invoice-title d-flex flex-column align-items-center">
                <img src="/assets/images/logo-dark.png" alt="logo" height="20" className="logo-dark ms-auto" />
              </div>
              <hr className="my-4" />

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="cliente_id" className="form-label">Cliente</label>
                    <select
                      id="cliente_id"
                      className="form-select"
                      name="cliente_id"
                      value={formData.cliente_id}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    >
                      <option value="">Seleccione un cliente</option>
                      {clientes.map((cliente) => (
                        <option key={cliente._id} value={cliente._id}>
                          {cliente.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="tipo_interaccion" className="form-label">Tipo de Interacción</label>
                    <select
                      id="tipo_interaccion"
                      className="form-select"
                      name="tipo_interaccion"
                      value={formData.tipo_interaccion}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    >
                      {TIPO_INTERACCION_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="fecha" className="form-label">Fecha</label>
                    <input
                      type="date"
                      className="form-control"
                      id="fecha"
                      name="fecha"
                      value={formData.fecha}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="hora" className="form-label">Hora</label>
                    <input
                      type="time"
                      className="form-control"
                      id="hora"
                      name="hora"
                      value={formData.hora}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="descripcion" className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    id="descripcion"
                    name="descripcion"
                    rows="4"
                    value={formData.descripcion}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="responsable" className="form-label">Responsable</label>
                    <input
                      type="text"
                      className="form-control"
                      id="responsable"
                      name="responsable"
                      value={formData.responsable}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="estado" className="form-label">Estado</label>
                    <select
                      id="estado"
                      className="form-select"
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      disabled={isLoading}
                    >
                      {ESTADO_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="d-print-none mt-4">
                  <div className="float-end">
                    <button 
                      type="button" 
                      className="btn btn-secondary me-2" 
                      onClick={() => navigate('/ListaInteraccions')}
                      disabled={isLoading}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary w-md waves-effect waves-light"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                          Guardando...
                        </>
                      ) : "Guardar Interacción"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {showAlert && (
        <AlertComponent
          type={alertType}
          entity="Interacción"
          action={alertType === "success" ? "create" : "error"}
          onCancel={handleAlertClose}
          message={alertMessage}
        />
      )}
    </Layout>
  );
};

export default CrearInteraccion;