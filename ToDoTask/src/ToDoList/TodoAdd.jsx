import { useForm } from '../hook/useForm';


export const TodoAdd = ({ onNewTodo }) => {
  const { description, onInputChange, onResetForm } = useForm({
    description: "",
  });

  const onFormSubmit = (event) => {
    event.preventDefault();
    if (description.trim().length <= 1) return;

    const newTodo = {
      id: new Date().getTime(),
      done: false,
      description,
    };

    onNewTodo(newTodo);
    onResetForm();

  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <h1>Formulario</h1>
      <hr />

      {/* Campos de entrada */}
      <input
        type="text"
        className="form-control"
        placeholder="Username"
        name="username"
        value={description}
        onChange={handleImageUpload}
      />

      <input
        type="email"
        className="form-control mt-2"
        placeholder="correo@gmail.com"
        name="email"
        value={description}
        onChange={handleImageUpload}
      />

      <input
        type="text"
        className="form-control mt-2"
        placeholder="Área"
        name="password"
        value={description}
        onChange={handleImageUpload}
      />

      {/* Selección de Fecha */}
      <h2 className="text-xl font-bold mb-4 mt-3">Seleccionar Fecha</h2>
      <div className="mb-4">
        <input type="date" className="form-control" />
      </div>

      {/* Subida de Imagen */}
      <h2 className="text-xl font-bold mb-4 mt-3">Subir Imagen</h2>
      <div className="mb-4">
        <input type="file" accept="image/*" className="btn btn-primary mt-2" />
      </div>

      {/* Lista de Tareas */}
      <h2 className="text-xl font-bold mb-4">Lista de Tareas</h2>

      {/* Formulario de Agregar Tarea */}
      <form onSubmit={onFormSubmit}>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="¿Qué hay que hacer?"
            className="form-control"
            name="description"
            value={description}
            onChange={onInputChange}
          />

          <button type="submit" className="btn btn-outline-primary mt-1">
            Agregar
          </button>
        </div>
      </form>

      {/* Botón Reset */}
      <button onClick={onResetForm} className="btn btn-primary mt-2">
        Borrar
      </button>
    </>
  );
};

