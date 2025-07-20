import "../../Styles/Modales/ModalAsistencias.css";

// ✅ La interfaz va fuera de la función
interface ModalAsistenciaProps {
  datos: {
    fecha: string;
    horaEntrada: string | null;
    horaEsperada: string;
  };
  onClose: () => void;
}

// ✅ Se usa la interfaz para tipar los props
export default function ModalAsistencia({ datos, onClose }: ModalAsistenciaProps) {
  const { fecha, horaEntrada, horaEsperada } = datos;

  return (
    <div className="modal-fondo">
      <div className="modal">
        <h3>Detalle de Asistencia - {fecha}</h3>
        <p><strong>Hora esperada:</strong> {horaEsperada}</p>
        <p><strong>Hora de llegada:</strong> {horaEntrada ?? "No asistió"}</p>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}
