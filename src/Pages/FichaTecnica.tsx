import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

import "../Styles/Vehiculos.css";

import ModalFichaTecnica from "../Components/ModalFichaTecnica";
import ModalEliminar from "../Components/ModalEliminar";

interface FichaTecnica {
  id: number;
  observaciones: string;
  diagnosticoInicial: string;
  servicios: string;
  repuestos: string;
  estado: string;
  idVehiculo: number;
  placaVehiculo: string;
  marcaVehiculo: string;
  colorVehiculo: string;
  nombreCliente: string;
  fingreso: string;
  fsalida: string;
}

const FichasTecnicas = () => {
  const [fichas, setFichas] = useState<FichaTecnica[]>([]);
  const [modalFichaAbierto, setModalFichaAbierto] = useState(false);

  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [idFichaSeleccionada, setIdFichaSeleccionada] = useState<number | null>(null);
  const [fichaEditar, setFichaEditar] = useState<FichaTecnica | null>(null);

  useEffect(() => {
    cargarFichasTecnicas();
    fetch("http://localhost:8080/api/fichas-tecnicas")
      .then((res) => res.json())
      .then((data) => setFichas(data))
      .catch((err) => console.error("Error al obtener fichas técnicas:", err));
  }, []);

  const formatearLista = (texto: string) => {
    return texto
      .split(",")
      .map((item, index) => <li key={index}>{item.trim()}</li>);
  };

  const traducirEstado = (estado: string) => {
    switch (estado) {
      case "EN_ESPERA":
        return "En espera";
      case "EN_REPARACION":
        return "En reparación";
      case "TERMINADO":
        return "Entregado";
      default:
        return estado;
    }
  };

  const confirmarEliminacion = async () => {
    if (idFichaSeleccionada === null) return;

    try {
      const res = await fetch(`http://localhost:8080/api/fichas-tecnicas/${idFichaSeleccionada}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }

      setFichas((prev) => prev.filter((f) => f.id !== idFichaSeleccionada));
      setModalEliminarAbierto(false);
      setIdFichaSeleccionada(null);
      alert("Ficha técnica eliminada con éxito.");
    } catch (err: any) {
      console.error("Error al eliminar ficha:", err.message);
      alert("Error al eliminar la ficha técnica: " + err.message);
    }
  };

  const cargarFichasTecnicas = () => {
    fetch("http://localhost:8080/api/fichas-tecnicas")
      .then((res) => res.json())
      .then((data) => setFichas(data))
      .catch((err) => console.error("Error al obtener fichas técnicas:", err));
  };

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
            {fichas.map((ficha) => (
              <tr key={ficha.id}>
                <td>{ficha.fingreso}</td>
                <td>{ficha.nombreCliente}</td>
                <td>{ficha.placaVehiculo}</td>
                <td>{ficha.marcaVehiculo}</td>
                <td>{ficha.colorVehiculo}</td>
                <td>
                  <ul style={{ paddingLeft: "1rem", margin: 0 }}>
                    {formatearLista(ficha.servicios)}
                  </ul>
                </td>
                <td>
                  <ul style={{ paddingLeft: "1rem", margin: 0 }}>
                    {formatearLista(ficha.repuestos)}
                  </ul>
                </td>
                <td>{ficha.fsalida ? ficha.fsalida : "—"}</td>
                <td>{traducirEstado(ficha.estado)}</td>
                <td>{ficha.fsalida ? ficha.fsalida : "—"}</td>
                <td>
                  <button
                    className="boton-editar"
                    onClick={() => {
                      setFichaEditar(ficha);            // ← Establece la ficha que se va a editar
                      setModalFichaAbierto(true);      // ← Abre el modal
                    }}
                  >
                    <FaEdit />
                  </button>

                </td>
                <td>
                  <button
                    className="boton-eliminar"
                    onClick={() => {
                      setIdFichaSeleccionada(ficha.id);
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

      <ModalFichaTecnica
        isOpen={modalFichaAbierto}
        onClose={() => {
          setModalFichaAbierto(false);
          setFichaEditar(null); // ← Limpia después de cerrar
        }}
        fichaEditar={fichaEditar}
        onRegistroExitoso={() => {
          cargarFichasTecnicas();
          setFichaEditar(null); // ← Limpia después de actualizar
        }}
      />

      <ModalEliminar
        isOpen={modalEliminarAbierto}
        onClose={() => setModalEliminarAbierto(false)}
        onConfirm={confirmarEliminacion}
        entidad="la ficha técnica"
      />

    </div>
  );
};

export default FichasTecnicas;
