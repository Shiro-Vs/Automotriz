import "../Styles/Modales/ModalNuevoEmpleado.css";
import { useState } from "react";

import ModalNuevoEmpleado from "../Components/ModalAgregarEmpleado";

const Empleados = () => {
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <>
      <div className="pagina-citas">
        <div className="encabezado-citas">
          <h1 className="titulo-citas">Trabajadores</h1>
          <button className="boton-agendar" onClick={() => setModalAbierto(true)}>
            Nuevo Empleado
          </button>
        </div>

        <div className="tabla-contenedor">
          <table className="tabla-citas">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>DNI / RUC</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Dirección</th>
                <th>F. Ingreso</th>
                <th>F. Retiro</th>
                <th>Estado</th>
                <th>Editar</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Juan Pérez</td>
                <td>12345678</td>
                <td>987654321</td>
                <td>juan@example.com</td>
                <td>Av. Siempre Viva 123</td>
                <td>2025-07-10</td>
                <td>2025-07-15</td>
                <td>Activo</td>
                <td>✏️</td>
                <td>🗑️</td>
              </tr>
              <tr>
                <td>Empresa XYZ SAC</td>
                <td>20123456789</td>
                <td>999888777</td>
                <td>contacto@xyzsac.com</td>
                <td>Jr. Los Robles 456</td>
                <td>2025-07-05</td>
                <td>2025-07-20</td>
                <td>Inactivo</td>
                <td>✏️</td>
                <td>🗑️</td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>

      <ModalNuevoEmpleado
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
      />
    </>
  );
};

export default Empleados;
