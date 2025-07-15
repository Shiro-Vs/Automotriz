import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

import "../Styles/General.css";
import "../Styles/Componentes/Tablas.css";
import "../Styles/Componentes/Filtros.css";

import ModalEliminar from "../Components/ModalEliminar";
import ModalEditarClienteVehiculo from "../Components/ModalEditarClienteVehiculo";
import FormatoInputs from "../Components/FormatoInputs";

interface Cliente {
  id: number;
  nombre: string;
  dni: string;
  celular: string;
  email: string;
  direccion: string;
}

const Clientes = () => {

  // Formatear inputs
  const [telefono, setTelefono] = useState("");


  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [clienteSeleccionadoId, setClienteSeleccionadoId] = useState<number | null>(null);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false); // 👈 Modal Editar
  const [clienteEditando, setClienteEditando] = useState<Cliente>({
    id: 0,
    nombre: '',
    dni: '',
    celular: '',
    email: '',
    direccion: ''
  });

  const eliminarCliente = async () => {
    if (clienteSeleccionadoId === null) return;

    try {
      const res = await fetch(`http://localhost:8080/api/clientes/${clienteSeleccionadoId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setClientes((prev) => prev.filter((c) => c.id !== clienteSeleccionadoId));
        alert("Cliente eliminado correctamente.");
      } else {
        const msg = await res.text();
        alert("Error: " + msg);
      }
    } catch (err) {
      console.error("Error al eliminar cliente:", err);
      alert("Error inesperado al eliminar el cliente.");
    } finally {
      setClienteSeleccionadoId(null);
      setModalEliminarAbierto(false);
    }
  };

  const handleEditarClick = (cliente: Cliente) => {
    setClienteEditando(cliente); // carga los datos
    setModalEditarAbierto(true); // abre modal
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClienteEditando((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const guardarCambios = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/clientes/${clienteEditando.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clienteEditando),
      });

      if (res.ok) {
        const actualizado = clienteEditando;
        setClientes((prev) =>
          prev.map((c) => (c.id === actualizado.id ? actualizado : c))
        );
        alert("Cliente actualizado correctamente.");
        setModalEditarAbierto(false);
      } else {
        const msg = await res.text();
        alert("Error: " + msg);
      }
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      alert("Error inesperado al actualizar el cliente.");
    }
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/clientes")
      .then((res) => res.json())
      .then((data) => setClientes(data))
      .catch((err) => console.error("Error al obtener clientes:", err));
  }, []);

  return (
    <div className="pagina-citas">
      <div className="encabezado-citas">
        <h1 className="titulo-citas">Clientes</h1>
      </div>

      <div className="contenido-principal">
        <div className="tabla-contenedor">
          <table className="tabla-citas">
            <thead>
              <tr>
                <th>Nombre / Razón social</th>
                <th>DNI / RUC</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Dirección</th>
                <th>Editar</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.dni}</td>
                  <td>{cliente.celular}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.direccion}</td>
                  <td>
                    <button className="boton-editar" onClick={() => handleEditarClick(cliente)}>
                      <FaEdit />
                    </button>
                  </td>
                  <td>
                    <button
                      className="boton-eliminar"
                      onClick={() => {
                        setClienteSeleccionadoId(cliente.id);
                        setModalEliminarAbierto(true);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="filtros-contenedor">
          <h3>Filtrar clientes</h3>

          <label htmlFor="nombre">Nombre o Razón Social:</label>
          <input
            id="nombre"
            type="text"
            placeholder="Ej. Juan Pérez o Mi Empresa SAC"
            className="input-estilo"
          />

          <label htmlFor="documento">DNI o RUC:</label>
          <input
            id="documento"
            type="text"
            placeholder="Ej. 12345678 o 20123456789"
            className="input-estilo"
          />

          <label htmlFor="telefono">Teléfono:</label>
          <FormatoInputs
            tipo="telefono"
            valor={telefono}
            onChange={setTelefono}
            placeholder="Ej. 987654321"
            className="input-estilo"
          />

          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="text"
            placeholder="correo@ejemplo.com"
            className="input-estilo"
          />

          <div className="contenedor-botones">
            <button className="boton-filtrar">Filtrar</button>
            <button className="boton-exportar">Exportar Excel</button>
          </div>
        </div>
      </div>

      <ModalEliminar
        isOpen={modalEliminarAbierto}
        onClose={() => setModalEliminarAbierto(false)}
        onConfirm={eliminarCliente}
        entidad="el cliente"
      />

      <ModalEditarClienteVehiculo
        isOpen={modalEditarAbierto}
        onClose={() => setModalEditarAbierto(false)}
        titulo="Editar Cliente"
        campos={[
          { name: 'nombre', label: 'Nombre / Razón Social', type: 'text', value: clienteEditando.nombre },
          { name: 'dni', label: 'DNI / RUC', type: 'text', value: clienteEditando.dni },
          { name: 'celular', label: 'Teléfono', type: 'text', value: clienteEditando.celular },
          { name: 'email', label: 'Email', type: 'email', value: clienteEditando.email },
          { name: 'direccion', label: 'Dirección', type: 'text', value: clienteEditando.direccion },
        ]}
        onChange={handleInputChange}
        onSubmit={guardarCambios}
      />

    </div>
  );
};

export default Clientes;
