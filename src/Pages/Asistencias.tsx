import { useState, useEffect } from "react";
import CalendarioAsistencias from "../Components/CalendarioAsistencias";
import "../Styles/General.css";
import "../Styles/Asistencias.css";

interface Trabajador {
  id: number;
  nombre: string;
  dni: string;
  rol: string;
  estado: boolean;
}

const Asistencias = () => {
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState<number | null>(null);
  const [datosTrabajador, setDatosTrabajador] = useState<Trabajador | null>(null);

  useEffect(() => {
    const fetchTrabajadores = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/trabajadores/activos");
        const data = await response.json();
        setTrabajadores(data);
        if (data.length > 0) {
          setTrabajadorSeleccionado(data[0].id); // selecciona el primero
          setDatosTrabajador(data[0]);
        }
      } catch (error) {
        console.error("Error al cargar trabajadores:", error);
      }
    };

    fetchTrabajadores();
  }, []);

  useEffect(() => {
    const seleccionado = trabajadores.find(t => t.id === trabajadorSeleccionado);
    setDatosTrabajador(seleccionado || null);
  }, [trabajadorSeleccionado, trabajadores]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const entrada = formData.get("entrada");
    const salida = formData.get("salida");
    const descansos = formData.getAll("descanso");

    console.log({ entrada, salida, descansos });
    // Aquí podrías enviar los datos al backend
  };

  return (
    <div className="pagina-citas">
      <div className="encabezado-citas">
        <h1 className="titulo-citas">Asistencias</h1>

        <select
          className="select-trabajador"
          value={trabajadorSeleccionado || ""}
          onChange={(e) => setTrabajadorSeleccionado(Number(e.target.value))}
        >
          {trabajadores.map((trabajador) => (
            <option key={trabajador.id} value={trabajador.id}>
              {trabajador.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="bloque-datos-y-cards">
        <div className="datos-trabajador">
          <p><strong>Nombre:</strong> {datosTrabajador?.nombre || "-"}</p>
          <p><strong>DNI:</strong> {datosTrabajador?.dni || "-"}</p>
          <p><strong>Rol:</strong> {datosTrabajador?.rol || "-"}</p>
          <p><strong>Horario:</strong> 8:00 a 17:00</p>
          <p><strong>Días de descanso:</strong> Domingo</p>
        </div>

        <div className="contenedor-cards">
          <div className="cards-resumen">
            <div className="card resumen asistencias">
              <h4>Asistencias</h4>
              <p>20</p>
            </div>
            <div className="card resumen tardanzas">
              <h4>Tardanzas</h4>
              <p>3</p>
            </div>
            <div className="card resumen faltas">
              <h4>Faltas</h4>
              <p>1</p>
            </div>
          </div>
        </div>
      </div>

      <div className="contenido-asistencias">
        <CalendarioAsistencias />

        <form className="horarios-trabajador" onSubmit={handleSubmit}>
          <h3>Horarios</h3>

          <label>
            <strong>Hora de entrada:</strong>
            <input type="time" name="entrada" required />
          </label>

          <label>
            <strong>Hora de salida:</strong>
            <input type="time" name="salida" required />
          </label>

          <div className="dias-descanso">
            <strong>Días de descanso:</strong>
            <div className="checkboxes">
              {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((dia) => (
                <label key={dia}>
                  <input type="checkbox" name="descanso" value={dia} />
                  {dia}
                </label>
              ))}
            </div>
          </div>

          <button type="submit">Guardar</button>
        </form>
      </div>
    </div>
  );
};

export default Asistencias;
