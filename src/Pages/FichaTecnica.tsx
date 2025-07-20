import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

import "../Styles/General.css";
import "../Styles/FichaTecnica.css";
import "../Styles/Componentes/Tablas.css";
import "../Styles/Componentes/Filtros.css";

import FormatoInputs from "../Components/FormatoInputs";
import InputFechas from "../Components/InputFechas";

import ModalFichaTecnica from "../Components/Modales/ModalFichaTecnica";
import ModalEliminar from "../Components/Modales/ModalEliminar";

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

  //Formatear inputs
  const [placa, setPlaca] = useState("");

  //Fechas
  const [fechaDesde, setFechaDesde] = useState<Date | null>(null);
  const [fechaHasta, setFechaHasta] = useState<Date | null>(null);

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
    <div className="pagina-citas pagina-fichas">
      <div className="encabezado-citas">
        <h1 className="titulo-citas">Ficha Técnica</h1>
        <button
          className="boton-agendar"
          onClick={() => setModalFichaAbierto(true)}
        >
          Agregar Ficha Técnica
        </button>
      </div>

      <div className="contenido-principal">
        <div className="tabla-contenedor">
          <table className="tabla-citas">
            <thead>
              <tr>
                <th>F. de ingreso</th>
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
                  <td className="texto-centrado-bloque">
                    <ul style={{ paddingLeft: "1rem", margin: 0 }}>
                      {formatearLista(ficha.servicios)}
                    </ul>
                  </td>
                  <td className="texto-centrado-bloque">
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
                        setFichaEditar(ficha);
                        setModalFichaAbierto(true);
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

        <div className="filtros-contenedor">
          <h3>Filtros</h3>

          <label>Fecha desde:</label>
          <InputFechas
            fecha={fechaDesde}
            onChange={setFechaDesde}
            placeholder="dd/mm/aaaa"
          />

          <label>Fecha hasta:</label>
          <InputFechas
            fecha={fechaHasta}
            onChange={setFechaHasta}
            placeholder="dd/mm/aaaa"
          />

          <label>Nombre del cliente:</label>
          <input type="text" placeholder="Ej: Juan Pérez" />

          <label>Placa:</label>
          <FormatoInputs tipo="placa" valor={placa} onChange={setPlaca} placeholder="ABC-123" />

          <label>Marca:</label>
          <input type="text" placeholder="Ej: Toyota" />

          <label>Estado:</label>
          <select>
            <option value="">Todos</option>
            <option value="EN_REPARACION">En reparación</option>
            <option value="EN_ESPERA">En espera</option>
            <option value="TERMINADO">Entregado</option>
          </select>

          <div className="contenedor-botones">
            <button className="boton-filtrar">Filtrar</button>
            <button className="boton-exportar">Exportar Excel</button>
            <button className="boton-limpiar">Limpiar filtros</button>
          </div>
        </div>

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
