  import { useState, useEffect, useRef } from "react";
  import CalendarioAsistencias from "../Components/CalendarioAsistencias";
  import "../Styles/General.css";
  import "../Styles/Asistencias.css";
  import axios from "axios";
  import ModalRegistroExito from "../Components/Modales/ModalRegistroExito";

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
    const [horario, setHorario] = useState<{ horaEntrada: string; horaSalida: string; diasDescanso: string } | null>(null);
    const [modalAbierto, setModalAbierto] = useState(false);
    const formularioRef = useRef<HTMLFormElement | null>(null);
    const [estadisticas, setEstadisticas] = useState({
      asistencias: 0,
      tardanzas: 0,
      faltas: 0,
    });

    useEffect(() => {
      const fetchTrabajadores = async () => {
        try {
          const response = await fetch("${import.meta.env.VITE_API_URL}/trabajadores/activos");
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
      const fetchEstadisticas = async () => {
        if (!trabajadorSeleccionado) return;

        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/asistencias/trabajador/${trabajadorSeleccionado}`);
          const asistencias = response.data;

          let asistenciasCount = 0;
          let tardanzasCount = 0;
          let faltasCount = 0;

          asistencias.forEach((a: any) => {
            if (a.falto) faltasCount++;
            else {
              asistenciasCount++;
              if (a.llegoTarde) tardanzasCount++;
            }
          });

          setEstadisticas({
            asistencias: asistenciasCount,
            tardanzas: tardanzasCount,
            faltas: faltasCount,
          });
        } catch (error) {
          console.error("Error al cargar estadísticas:", error);
          setEstadisticas({ asistencias: 0, tardanzas: 0, faltas: 0 });
        }
      };

      fetchEstadisticas();
    }, [trabajadorSeleccionado]);

    useEffect(() => {
      const seleccionado = trabajadores.find(t => t.id === trabajadorSeleccionado);
      setDatosTrabajador(seleccionado || null);
    }, [trabajadorSeleccionado, trabajadores]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);
      const entradaRaw = formData.get("entrada") as string;
      const salidaRaw = formData.get("salida") as string;

      const toHHMM = (hora: string) => hora.length > 5 ? hora.slice(0, 5) : hora;

      const entrada = toHHMM(entradaRaw);
      const salida = toHHMM(salidaRaw);

      const checkboxes = e.currentTarget.querySelectorAll('input[name="descanso"]:checked');
      const diasSeleccionados: string[] = Array.from(checkboxes).map((checkbox) => (checkbox as HTMLInputElement).value);

      const horarioDTO = {
        idTrabajador: trabajadorSeleccionado,
        horaEntrada: entrada,
        horaSalida: salida,
        diasDescanso: diasSeleccionados.join(","),
      };

      try {
        const response = await axios.post("${import.meta.env.VITE_API_URL}/horarios/guardar", horarioDTO);
        if (response.status === 200) {
          setModalAbierto(true);

          // ✅ Limpia el formulario con ref
          formularioRef.current?.reset();

          // 🔄 Actualiza los datos
          const nuevaRespuesta = await axios.get(`${import.meta.env.VITE_API_URL}/horarios/trabajador/${trabajadorSeleccionado}`);
          setHorario(nuevaRespuesta.data);
        } else {
          console.error("❌ Error al registrar horario:", response);
        }
      } catch (error) {
        console.error("⚠️ Error de red o servidor:", error);
      }
    };


    useEffect(() => {
      const fetchHorario = async () => {
        if (!trabajadorSeleccionado) return;

        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/horarios/trabajador/${trabajadorSeleccionado}`);
          setHorario(response.data);
        } catch (error) {
          console.error("Error al cargar horario:", error);
          setHorario(null); // en caso de que no exista horario aún
        }
      };

      fetchHorario();
    }, [trabajadorSeleccionado]);

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
            <p><strong>Horario:</strong> {horario ? `${horario.horaEntrada} a ${horario.horaSalida}` : "-"}</p>
            <p><strong>Días de descanso:</strong> {horario?.diasDescanso || "-"}</p>
          </div>

          <div className="contenedor-cards">
            <div className="cards-resumen">
              <div className="card resumen asistencias">
                <h4>Asistencias</h4>
                <p>{estadisticas.asistencias}</p>
              </div>
              <div className="card resumen tardanzas">
                <h4>Tardanzas</h4>
                <p>{estadisticas.tardanzas}</p>
              </div>
              <div className="card resumen faltas">
                <h4>Faltas</h4>
                <p>{estadisticas.faltas}</p>
              </div>

            </div>
          </div>
        </div>

        <div className="contenido-asistencias">
          <CalendarioAsistencias idTrabajador={trabajadorSeleccionado || 0} />

          <form ref={formularioRef} className="horarios-trabajador" onSubmit={handleSubmit}>
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

        <ModalRegistroExito
          isOpen={modalAbierto}
          onClose={() => setModalAbierto(false)}
          mensaje="El horario fue registrado exitosamente."
          titulo="¡Registro exitoso!"
        />

      </div>
    );
  };

  export default Asistencias;
