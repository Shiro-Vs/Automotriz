import { useState } from "react";
import CalendarioAsistencias from "../Components/CalendarioAsistencias";
import "../Styles/General.css";
import "../Styles/Asistencias.css";

const Asistencias = () => {
  const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState("1");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const entrada = formData.get("entrada");
    const salida = formData.get("salida");
    const descansos = formData.getAll("descanso"); // Obtiene todos los checkboxes marcados

    console.log({ entrada, salida, descansos });

    // Aquí podrías enviar los datos al backend, por ejemplo usando fetch o axios
  };

  return (
    <div className="pagina-citas">
      <div className="encabezado-citas">
        <h1 className="titulo-citas">Asistencias</h1>
        <select
          className="select-trabajador"
          value={trabajadorSeleccionado}
          onChange={(e) => setTrabajadorSeleccionado(e.target.value)}
        >
          <option value="1">Juan Pérez</option>
          <option value="2">Ana Gómez</option>
          <option value="3">Carlos Ruiz</option>
        </select>
      </div>

      <div className="bloque-datos-y-cards">
        <div className="datos-trabajador">
          <p><strong>Nombre:</strong> Juan Pérez</p>
          <p><strong>DNI:</strong> 12345678</p>
          <p><strong>Rol:</strong> Mecánico</p>
          <p><strong>Días de descanso:</strong> Domingo</p>
        </div>

        {/* NUEVO CONTENEDOR DE LOS CARDS */}
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
