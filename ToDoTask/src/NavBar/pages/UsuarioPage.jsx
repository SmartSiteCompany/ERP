import { Navigate, useNavigate, useParams } from "react-router";
import { getUsuarioById } from "../helpers";
import { useMemo } from "react";

export const UsuarioPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Obtener usuario por ID
  const user = useMemo(() => getUsuarioById(id), [id]);

  // Si no se encuentra el usuario, redirigir a una página de error o lista
  if (!user) {
    return <Navigate to="/inicio" />;
  }

  const onNavigateBack = () => {
    navigate(-1);
  };

  return (
    <div className="row mt-5">
      <div className="col-4">
        <img
          src={`/assets/image/${ id }.jpg`} // Cambié 'image' por 'images'
          alt={user.username}
          className="img-thumbnail animate__animated animate__fadeInLeft bg-black"
        />
      </div>

      <div className="col-8 mt-5">
        <h3>{user.username}</h3>
        <ul className="list-group list-group-flush">
          <li className="list-group-item"><b>Email:</b> {user.email}</li>
          <li className="list-group-item"><b>Área:</b> {user.area}</li>
        </ul>

        <h5 className="mt-5">Descripción</h5>
        <p>########</p>

        <button className="btn btn-outline-primary" onClick={onNavigateBack}>
          Regresar
        </button>
      </div>
    </div>
  );
};
