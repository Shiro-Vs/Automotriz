// src/Pages/FichaTecnica.tsx
import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

import "../Styles/Vehiculos.css";
import ModalFichaTecnica from "../Components/ModalFichaTecnica";

const FichaTecnica = () => {

  const [modalFichaAbierto, setModalFichaAbierto] = useState(false);

  return (
    <div className="pagina-citas">
      <div className="encabezado-citas">
        <h1 className="titulo-citas">Ficha Técnica</h1>
        <button
          className="boton-agendar"
          onClick={() => setModalFichaAbierto(true)}
        >
          Agregar Ficha Técnica
        </button>
      </div>

      <div className="tabla-contenedor">
        <table className="tabla-citas">
          <thead>
            <tr>
              <th>Fecha de ingreso</th>
              <th>Nombre</th>
              <th>Placa</th>
              <th>Marca</th>
              <th>Color</th>
              <th>Servicio</th>
              <th>Repuestos</th>
              <th>F. Estimada</th>
              <th>Estado</th>
              <th>F. de Entrega</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025-07-06</td>
              <td>Juan Pérez</td>
              <td>ABC-123</td>
              <td>Toyota</td>
              <td>Rojo</td>
              <td>
                <ul style={{ paddingLeft: "1rem", margin: 0 }}>
                  <li>Cambio de aceite</li>
                  <li>Revisión general</li>
                </ul>
              </td>
              <td>
                <ul style={{ paddingLeft: "1rem", margin: 0 }}>
                  <li>Filtro de aceite</li>
                  <li>Junta de motor</li>
                </ul>
              </td>
              <td>2025-07-08</td>
              <td>En reparación</td>
              <td>—</td>
              <td>
                <button className="boton-editar"><FaEdit /></button>
              </td>
              <td>
                <button className="boton-eliminar"><FaTrash /></button>
              </td>
            </tr>
            <tr>
              <td>2025-07-09</td>
              <td>María Gómez</td>
              <td>XYZ-789</td>
              <td>Hyundai</td>
              <td>Azul</td>
              <td>
                <ul style={{ paddingLeft: "1rem", margin: 0 }}>
                  <li>Cambio de frenos</li>
                </ul>
              </td>
              <td>
                <ul style={{ paddingLeft: "1rem", margin: 0 }}>
                  <li>Pastillas de freno</li>
                </ul>
              </td>
              <td>2025-07-10</td>
              <td>Entregado</td>
              <td>2025-07-10</td>
              <td>
                <button className="boton-editar"><FaEdit /></button>
              </td>
              <td>
                <button className="boton-eliminar"><FaTrash /></button>
              </td>
            </tr>
            <tr>
              <td>2025-07-10</td>
              <td>Carlos Ruiz</td>
              <td>MNO-456</td>
              <td>Kia</td>
              <td>Negro</td>
              <td>
                <ul style={{ paddingLeft: "1rem", margin: 0 }}>
                  <li>Sistema eléctrico</li>
                  <li>Otro: Revisar luces</li>
                </ul>
              </td>
              <td>
                <ul style={{ paddingLeft: "1rem", margin: 0 }}>
                  <li>Fusibles</li>
                </ul>
              </td>
              <td>2025-07-12</td>
              <td>En espera</td>
              <td>—</td>
              <td>
                <button className="boton-editar"><FaEdit /></button>
              </td>
              <td>
                <button className="boton-eliminar"><FaTrash /></button>
              </td>
            </tr>
          </tbody>
        </table>

      </div>

      <ModalFichaTecnica
        isOpen={modalFichaAbierto}
        onClose={() => setModalFichaAbierto(false)}
      />
    </div>
  );
};

export default FichaTecnica;
