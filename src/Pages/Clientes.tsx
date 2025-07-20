import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

import "../Styles/General.css";
import "../Styles/Componentes/Tablas.css";
import "../Styles/Componentes/Filtros.css";

import ModalEliminar from "../Components/Modales/ModalEliminar";
import ModalEditarClienteVehiculo from "../Components/Modales/ModalEditarClienteVehiculo";
import FormatoInputs from "../Components/FormatoInputs";
import Filtros from "../Components/Filtros";

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
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroDocumento, setFiltroDocumento] = useState("");
  const [filtroTelefono, setFiltroTelefono] = useState("");
  const [filtroEmail, setFiltroEmail] = useState("");
  const [documento, setDocumento] = useState(""); // para dni o ruc

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

  const aplicarFiltros = () => {
    fetch("http://localhost:8080/api/clientes")
      .then((res) => res.json())
      .then((data) => {
        const filtrados = data.filter((cliente: Cliente) => {
          const coincideNombre = cliente.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
          const coincideDocumento = cliente.dni.includes(filtroDocumento);
          const coincideTelefono = cliente.celular.includes(filtroTelefono);
          const coincideEmail = cliente.email?.toLowerCase().includes(filtroEmail.toLowerCase()) ?? false;
          return coincideNombre && coincideDocumento && coincideTelefono && coincideEmail;
        });
        setClientes(filtrados);
      })
      .catch((err) => console.error("Error al filtrar clientes:", err));
  };

  const exportarClientesExcel = () => {
    alert("Función de exportar aún no implementada");
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
                  <td>{cliente.email || "Sin correo!"}</td>
                  <td>{cliente.direccion || "Sin dirección!"}</td>
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
        <Filtros
          titulo="Filtrar clientes"
          campos={[
            { tipo: "input", label: "Nombre o Razón Social", value: filtroNombre, onChange: setFiltroNombre, placeholder: "Ej. Juan Pérez" },
            { tipo: "formato", label: "DNI o RUC", value: filtroDocumento, onChange: setFiltroDocumento, formatoTipo: undefined, placeholder: "Ej. 20123456789 o 12345678" },
            { tipo: "formato", label: "Teléfono", value: filtroTelefono, onChange: setFiltroTelefono, formatoTipo: "telefono", placeholder: "Ej. 987654321" },
            { tipo: "input", label: "Email", value: filtroEmail, onChange: setFiltroEmail, placeholder: "correo@ejemplo.com" },
          ]}
          onFiltrar={() => aplicarFiltros()}
          onExportar={() => exportarClientesExcel()}
          onLimpiar={() => {
            setFiltroNombre("");
            setFiltroDocumento("");
            setFiltroTelefono("");
            setFiltroEmail("");
          }}
        />

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
