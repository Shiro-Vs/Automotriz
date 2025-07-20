import { useState } from "react";
import ModalAsistencia from "./Modales/ModalAsistencias";
import "../Styles/Componentes/CalendarioAsistencias.css";

interface Asistencia {
    estado: "puntual" | "tardanza" | "falta";
    horaEntrada: string | null;
    horaEsperada: string;
}

const asistencias: Record<string, Asistencia> = {
    "2025-07-12": { estado: "puntual", horaEntrada: "08:00", horaEsperada: "08:00" },
    "2025-07-13": { estado: "tardanza", horaEntrada: "08:20", horaEsperada: "08:00" },
    "2025-07-14": { estado: "falta", horaEntrada: null, horaEsperada: "08:00" },
};

const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export default function CalendarioAsistencias() {
    const today = new Date();
    const [mes, setMes] = useState(today.getMonth()); // 0 = Enero
    const [anio, setAnio] = useState(today.getFullYear());
    const [fechaSeleccionada, setFechaSeleccionada] = useState<{
        fecha: string;
        horaEntrada: string | null;
        horaEsperada: string;
    } | null>(null);

    const diasDelMes = new Date(anio, mes + 1, 0).getDate(); // total de días del mes

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

    return (
        <div className="calendario">
            {/* Encabezado de navegación */}
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

            {/* Cuadrícula de días */}
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

            {/* Modal de asistencia */}
            {fechaSeleccionada && (
                <ModalAsistencia datos={fechaSeleccionada} onClose={() => setFechaSeleccionada(null)} />
            )}
        </div>
    );
}
