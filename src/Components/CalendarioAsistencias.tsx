import { useEffect, useState } from "react";
import ModalAsistencia from "./Modales/ModalAsistencias";
import "../Styles/Componentes/CalendarioAsistencias.css";
import axios from "axios";

interface Asistencia {
  estado: "puntual" | "tardanza" | "falta";
  horaEntrada: string | null;
  horaEsperada: string;
}

interface Props {
  idTrabajador: number;
}

export default function CalendarioAsistencias({ idTrabajador }: Props) {
  const today = new Date();
  const [mes, setMes] = useState(today.getMonth());
  const [anio, setAnio] = useState(today.getFullYear());
  const [fechaSeleccionada, setFechaSeleccionada] = useState<{
    fecha: string;
    horaEntrada: string | null;
    horaEsperada: string;
  } | null>(null);

  const [asistencias, setAsistencias] = useState<Record<string, Asistencia>>({});

  const diasDelMes = new Date(anio, mes + 1, 0).getDate();

  useEffect(() => {
    const fetchAsistencias = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/asistencias/trabajador/${idTrabajador}`);
        const data = response.data;

        const formateadas: Record<string, Asistencia> = {};

        data.forEach((a: any) => {
          const fecha = a.fecha; // formato YYYY-MM-DD
          let estado: "puntual" | "tardanza" | "falta" = "puntual";

          if (a.falto) estado = "falta";
          else if (a.llegoTarde) estado = "tardanza";

          formateadas[fecha] = {
            estado,
            horaEntrada: a.horaEntrada,
            horaEsperada: a.horaEsperada || "08:00", // puedes ajustar esto
          };
        });

        setAsistencias(formateadas);
      } catch (error) {
        console.error("Error al cargar asistencias:", error);
      }
    };

    fetchAsistencias();
  }, [idTrabajador]);

  const obtenerClaseEstado = (fecha: string) => {
    const data = asistencias[fecha];
    return data?.estado || "";
  };

  const abrirModal = (dia: number) => {
    const fecha = `${anio}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
    const data = asistencias[fecha];
    if (data) {
      setFechaSeleccionada({ fecha, ...data });
    }
  };

  const cambiarMes = (valor: number) => {
    const nuevaFecha = new Date(anio, mes + valor, 1);
    setMes(nuevaFecha.getMonth());
    setAnio(nuevaFecha.getFullYear());
  };

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return (
    <div className="calendario">
      <div className="encabezado">
        <button onClick={() => cambiarMes(-1)}>←</button>
        <h3>{meses[mes]} {anio}</h3>
        <button onClick={() => cambiarMes(1)}>→</button>
      </div>

      <div className="encabezado-semana">
        <div>Dom</div>
        <div>Lun</div>
        <div>Mar</div>
        <div>Mié</div>
        <div>Jue</div>
        <div>Vie</div>
        <div>Sáb</div>
      </div>

      <div className="dias">
        {Array.from({ length: diasDelMes }, (_, i) => {
          const dia = i + 1;
          const fecha = `${anio}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
          return (
            <div
              key={dia}
              className={`dia ${obtenerClaseEstado(fecha)}`}
              onClick={() => abrirModal(dia)}
            >
              {dia}
            </div>
          );
        })}
      </div>

      {fechaSeleccionada && (
        <ModalAsistencia datos={fechaSeleccionada} onClose={() => setFechaSeleccionada(null)} />
      )}
    </div>
  );
}
