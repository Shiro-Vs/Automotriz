// src/Pages/FichaTecnica.tsx
import { useState } from "react";
import { FaEdit } from "react-icons/fa";

import "../Styles/Citas.css";
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
              <th>Diagnóstico inicial</th>
              <th>Servicios/Reparaciones</th>
              <th>Repuestos</th>
              <th>Fecha de salida</th>
              <th>Estado</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025-07-06</td>
              <td>Fuga de aceite en motor</td>
              <td>
                <ul style={{ paddingLeft: "1rem", margin: 0 }}>
                  <li>✔️ Cambio de aceite — $50</li>
                  <li>❌ Cambio de frenos — [ ] — $</li>
                  <li>❌ Revisión general — [ ] — $</li>
                  <li>❌ Alineación y balanceo — [ ] — $</li>
                  <li>❌ Sistema eléctrico — [ ] — $</li>
                  <li>❌ Otro: _____________ — $</li>
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
              <td>
                <button className="boton-editar">
                  <FaEdit />
                </button>
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
