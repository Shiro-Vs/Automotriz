import { useEffect, useState } from "react";

import "../Styles/General.css";
import "../Styles/Componentes/Tablas.css";
import "../Styles/Componentes/Filtros.css";

import "../Styles/Modales/ModalNuevoEmpleado.css";

import FormatoInputs from "../Components/FormatoInputs";
import ModalNuevoEmpleado from "../Components/ModalAgregarEmpleado";
import ModalEliminar from "../Components/ModalEliminar";

import { FaEdit, FaTrash } from "react-icons/fa";

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

  // Formatear inputs
  const [dni, setDni] = useState("");
  const [telefono, setTelefono] = useState("");

  // Modal para agregar/editar empleado
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoFormulario, setModoFormulario] = useState<"registrar" | "editar">("registrar");
  const [trabajadorAEditar, setTrabajadorAEditar] = useState<Trabajador | null>(null);

  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [idTrabajadorSeleccionado, setIdTrabajadorSeleccionado] = useState<number | null>(null);

  const cargarTrabajadores = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/trabajadores");
      const data = await res.json();
      setTrabajadores(data);
    } catch (error) {
      console.error("Error al cargar trabajadores:", error);
    }
  };

  const handleEliminarTrabajador = async () => {
    if (idTrabajadorSeleccionado !== null) {
      try {
        const res = await fetch(`http://localhost:8080/api/trabajadores/${idTrabajadorSeleccionado}`, {
          method: "DELETE",
        });

        if (res.ok) {
          cargarTrabajadores();
        } else {
          const mensaje = await res.text();
          alert(mensaje);
        }

        setIdTrabajadorSeleccionado(null);
        setModalEliminarAbierto(false);
      } catch (error) {
        console.error("Error al eliminar trabajador:", error);
        alert("Error inesperado al eliminar el trabajador.");
      }
    }
  };

  useEffect(() => {
    cargarTrabajadores();
  }, []);

  return (
    <>
      <div className="pagina-citas">
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
                {trabajadores.map((t) => (
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
          <div className="filtros-contenedor">
            <h3>Filtros</h3>

            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              placeholder="Ej. Carlos Huamán"
            />

            <label htmlFor="dni">DNI:</label>
            <FormatoInputs
              tipo="dni"
              valor={dni}
              onChange={setDni}
              placeholder="Ej. 12345678"
            />

            <label htmlFor="telefono">Teléfono:</label>
            <FormatoInputs
              tipo="telefono"
              valor={telefono}
              onChange={setTelefono}
              placeholder="Ej. 987654321"
            />

            <label htmlFor="estado">Estado:</label>
            <select>
              <option value="">Todos</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>

            <label htmlFor="rol">Rol:</label>
            <select>
              <option value="">Todos</option>
              <option value="activo">Admin</option>
              <option value="inactivo">Mecánico</option>
            </select>

            <div className="contenedor-botones">
              <button className="boton-filtrar">Filtrar</button>
              <button className="boton-exportar">Exportar Excel</button>
            </div>
          </div>
        </div>

      </div>

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
