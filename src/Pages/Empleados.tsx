// 📦 Dependencias
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

// 🎨 Estilos
import "../Styles/General.css";
import "../Styles/Componentes/Tablas.css";
import "../Styles/Componentes/Filtros.css";
import "../Styles/Modales/ModalNuevoEmpleado.css";

// 🧩 Componentes
import FormatoInputs from "../Components/FormatoInputs";
import Filtros from "../Components/Filtros";
import ModalNuevoEmpleado from "../Components/Modales/ModalAgregarEmpleado";
import ModalEliminar from "../Components/Modales/ModalEliminar";

// 🧾 Interfaces
interface Trabajador {
  id: number;
  nombre: string;
  dni: string;
  celular: string;
  email: string;
  direccion: string;
  contrasenia: string;
  fechaIngreso: string;
  fechaRetiro: string | null;
  estado: boolean;
  rol: string;
}

const Empleados = () => {
  // 🧪 Estados - Formato
  const [dni, setDni] = useState("");
  const [telefono, setTelefono] = useState("");

  // 🎯 Estados - Filtros
  const [nombre, setNombre] = useState("");
  const [estado, setEstado] = useState("");
  const [rol, setRol] = useState("");

  // 👷 Estados - Trabajadores
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [trabajadoresFiltrados, setTrabajadoresFiltrados] = useState<Trabajador[]>([]);
  const [idTrabajadorSeleccionado, setIdTrabajadorSeleccionado] = useState<number | null>(null);

  // 💬 Estados - Modales
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [modoFormulario, setModoFormulario] = useState<"registrar" | "editar">("registrar");
  const [trabajadorAEditar, setTrabajadorAEditar] = useState<Trabajador | null>(null);

  // 🔁 Cargar trabajadores desde API
  const cargarTrabajadores = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/trabajadores");
      const data = await res.json();
      setTrabajadores(data);
      setTrabajadoresFiltrados(data);
    } catch (error) {
      console.error("Error al cargar trabajadores:", error);
    }
  };

  useEffect(() => {
    cargarTrabajadores();
  }, []);

  // ❌ Eliminar trabajador
  const handleEliminarTrabajador = async () => {
    if (idTrabajadorSeleccionado === null) return;

    try {
      const res = await fetch(`http://localhost:8080/api/trabajadores/${idTrabajadorSeleccionado}`, {
        method: "DELETE"
      });

      if (res.ok) {
        cargarTrabajadores();
      } else {
        const mensaje = await res.text();
        alert(mensaje);
      }
    } catch (error) {
      console.error("Error al eliminar trabajador:", error);
      alert("Error inesperado al eliminar el trabajador.");
    } finally {
      setIdTrabajadorSeleccionado(null);
      setModalEliminarAbierto(false);
    }
  };

  // 🔍 Filtrar trabajadores
  const filtrarTrabajadores = () => {
    const filtrados = trabajadores.filter(t =>
      (!nombre || t.nombre.toLowerCase().includes(nombre.toLowerCase())) &&
      (!dni || t.dni.includes(dni)) &&
      (!telefono || t.celular.includes(telefono)) &&
      (!estado || (estado === "activo" ? t.estado : !t.estado)) &&
      (!rol || t.rol.toLowerCase() === rol.toLowerCase())
    );

    setTrabajadoresFiltrados(filtrados);
  };

  // 🔄 Limpiar filtros
  const limpiarFiltros = () => {
    setNombre("");
    setDni("");
    setTelefono("");
    setEstado("");
    setRol("");
    setTrabajadoresFiltrados(trabajadores);
  };

  return (
    <>
      <div className="pagina-citas">
        {/* Encabezado */}
        <div className="encabezado-citas">
          <h1 className="titulo-citas">Trabajadores</h1>
          <button
            className="boton-agendar"
            onClick={() => {
              setModoFormulario("registrar");
              setTrabajadorAEditar(null);
              setModalAbierto(true);
            }}
          >
            Nuevo Empleado
          </button>
        </div>

        <div className="contenido-principal">
          {/* Tabla */}
          <div className="tabla-contenedor">
            <table className="tabla-citas">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>DNI</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Dirección</th>
                  <th>F. Ingreso</th>
                  <th>F. Retiro</th>
                  <th>Estado</th>
                  <th>Rol</th>
                  <th>Editar</th>
                  <th>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {trabajadoresFiltrados.map(t => (
                  <tr key={t.id}>
                    <td>{t.nombre}</td>
                    <td>{t.dni}</td>
                    <td>{t.celular}</td>
                    <td>{t.email}</td>
                    <td>{t.direccion}</td>
                    <td>{t.fechaIngreso}</td>
                    <td>{t.fechaRetiro || "—"}</td>
                    <td>{t.estado ? "Activo" : "Inactivo"}</td>
                    <td>{t.rol}</td>
                    <td>
                      <button
                        className="boton-editar"
                        onClick={() => {
                          setModoFormulario("editar");
                          setTrabajadorAEditar(t);
                          setModalAbierto(true);
                        }}
                      >
                        <FaEdit />
                      </button>
                    </td>
                    <td>
                      <button
                        className="boton-eliminar"
                        onClick={() => {
                          setIdTrabajadorSeleccionado(t.id);
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

          {/* Filtros reutilizables */}
          <Filtros
            campos={[
              {
                tipo: "input",
                label: "Nombre:",
                value: nombre,
                onChange: setNombre,
                placeholder: "Ej. Carlos Huamán"
              },
              {
                tipo: "input",
                label: "DNI:",
                value: dni,
                onChange: setDni,
                placeholder: "Ej. 12345678",
                formatoTipo: "dni"
              },
              {
                tipo: "input",
                label: "Teléfono:",
                value: telefono,
                onChange: setTelefono,
                placeholder: "Ej. 987654321",
                formatoTipo: "telefono"
              },
              {
                tipo: "select",
                label: "Estado:",
                value: estado,
                onChange: setEstado,
                opciones: [
                  { label: "Todos", value: "" },
                  { label: "Activo", value: "activo" },
                  { label: "Inactivo", value: "inactivo" }
                ]
              },
              {
                tipo: "select",
                label: "Rol:",
                value: rol,
                onChange: setRol,
                opciones: [
                  { label: "Todos", value: "" },
                  { label: "Admin", value: "admin" },
                  { label: "Mecánico", value: "mecánico" }
                ]
              }
            ]}
            onFiltrar={filtrarTrabajadores}
            onExportar={() => console.log("Exportar empleados")}
            onLimpiar={limpiarFiltros}
          />
        </div>
      </div>

      {/* Modales */}
      <ModalNuevoEmpleado
        isOpen={modalAbierto}
        onClose={() => {
          setModalAbierto(false);
          cargarTrabajadores();
        }}
        modo={modoFormulario}
        trabajadorSeleccionado={trabajadorAEditar}
      />

      <ModalEliminar
        isOpen={modalEliminarAbierto}
        onClose={() => setModalEliminarAbierto(false)}
        onConfirm={handleEliminarTrabajador}
        entidad="el trabajador"
      />
    </>
  );
};

export default Empleados;
