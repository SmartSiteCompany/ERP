import React, { useState, useEffect } from "react";
import Layout from "../../layouts/pages/layout";
import { Link, useNavigate } from "react-router-dom";
import useSearchFilter from "../../hooks/useSearchFilter";
import usePagination from "../../hooks/usePagination";
import BotonesAccion from "../../components/BotonesAccion";
import AlertComponent from '../../components/AlertasComponent';
import LoadingError from "../../components/LoadingError";
import UserService from "../../services/UserService";

const Lista_usuarios = () => {
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const { loading, error, obtenerUsuarios, eliminarUsuario } = UserService();

    //Manda un hook de busqueda y filtrar
    const {
        searchTerm, filterType, filterValue,
        handleSearchChange, handleFilterTypeChange, handleFilterValueChange
    } = useSearchFilter("rol");

    const filteredUsuarios = users.filter((user) => {
        const nombre = user.name || ''; 
        const matchesSearch = nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterValue === "Todos" || user[filterType] === filterValue;
        return matchesSearch && matchesFilter;
    });
    const filterOptions = ["Todos", ...new Set(users.map((user) => user[filterType]))];

    //Manda un hook de busqueda y filtrar
    const { current: currentusers, currentPage, totalPages, setNextPage, setPreviousPage } = usePagination(filteredUsuarios, 5);

    //Obtiene a los usuarios
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const fetchedUsers = await obtenerUsuarios();
                setUsers(fetchedUsers);
            } catch (err) {
                console.error("Error al obtener usuarios:", err);
            }
        };
        fetchUsers();
    }, [obtenerUsuarios]); 
    
    //Elimina los usuarios
    const handleDelete = async (id) => {
        try {
            await eliminarUsuario(id);
            setUsers(users.filter(user => user._id !== id));
            setAlert({ type: "warning", action: "delete", entity: "usuario" });
            setTimeout(() => setAlert(null), 5000);
        } catch (err) {
            console.error("Error al eliminar usuario:", err);
        }
    };
    //confirma la eliminacion
    const handleConfirmDelete = (id) => {
        handleDelete(id);
        setAlert(null);
    };
    //Manda una alerta
    const handleCancelDelete = () => {
        setAlert(null);
    };

    //Manda a la vista 
    const handleView = (id) => {
        const user = users.find((u) => u._id === id); // Corregido: usa _id
        if (user) {
            navigate(`/usuario/ver/${id}`);
        } else {
            console.error('Usuario no encontrado');
        }
    };

    return (
        <LoadingError
          loading={loading}
          error={error}
          loadingMessage="Cargando datos..."
          errorMessage={error?.message}
        >
        <Layout>
            {/*Manda la alerta como un modal*/}
            {alert && (
                <AlertComponent
                    type={alert.type}
                    action={alert.action}
                    entity={alert.entity}
                    onConfirm={() => handleConfirmDelete(alert.id)}
                    onCancel={handleCancelDelete}
                />
            )}
            <div className="card p-3">
                <h2 className="mb-3 ">Lista de Usuarios</h2>

                <div className="col-md">
                    <div className="row">
                        {/* Barra de búsqueda (4 columnas) */}
                        <div className="col-md-4 mb-2">
                            <div className="input-group shadow-sm">
                                <input
                                    type="text"
                                    className="form-control pe-5"
                                    placeholder="Buscar Cliente ..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                <button type="button" className="btn btn-primary" style={{ marginLeft: '2px' }}>
                                    <i className="uil-search"></i>
                                </button>
                            </div>
                        </div>
                        <div className="col-md-4 mb-2 d-flex align-items-center">
                        <div className="input-group w-100 shadow-sm">
                            {/* Ícono de filtro fuera del grupo, con fondo redondeado */}
                            <span className="me-0 p-2 text-white bg-primary rounded-1 d-flex justify-content-center align-items-center">
                                <i className="uil-filter fs-6"></i>
                            </span>
                             {/* Select de tipo de filtro */}
                             <select className="form-select" value={filterType} onChange={handleFilterTypeChange}>
                                 <option value="rol">Filtrar por Rol</option>
                                 <option value="area">Filtrar por Área</option>
                             </select>
                             {/* Select dinámico de valores */}
                             <select className="form-select" value={filterValue} onChange={handleFilterValueChange}>
                                {filterOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                                ))}
                                </select>
                             </div>
                         </div>
                        <div className="col-md-4 mb-2">
                            <div className="input-group">
                                <Link to="/usuarios/CrearUsuario" className="input-daterange input-group btn btn-outline-success waves-effect waves-light">
                                    <i className="uil-user-plus fs-6"/> Crear Usuario
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-12">
                    <div className="table-responsive shadow-sm">
                        <table className="table table-centered table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                    <th>Área</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentusers.map((user) => (
                                    <tr key={user._id}>
                                        <td>{user._id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.apellidos}</td>
                                        <td>{user.email}</td>
                                        <td>{user.rol_user}</td>
                                        <td>{user.area}</td>
                                        <td>
                                            <BotonesAccion 
                                            id={user._id} 
                                            entidad="usuario"
                                            onDelete={handleDelete} 
                                            setAlert={setAlert}
                                            onView={() => handleView(user._id)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Paginacion */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <button
                        className="btn btn-secondary shadow-sm"
                        onClick={setPreviousPage}
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </button>
                    <span>Página {currentPage} de {totalPages}</span>
                    <button
                        className="btn btn-secondary shadow-sm"
                        onClick={setNextPage}
                        disabled={currentPage === totalPages}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
            <br />
        </Layout>
        </LoadingError>
      );
};

export default Lista_usuarios;