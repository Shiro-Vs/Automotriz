// 📁 src/Components/Modales/ModalRegistrarAsistencia.tsx

import '../../Styles/Modales/ModalRegistrarAsistencia.css';
import logo from '../../assets/Logos/Logo.png';

interface ModalRegistrarAsistenciaProps {
  onClose: () => void;
  registrar: (confirmado: boolean) => void;
  idTrabajador: number;
}

const ModalRegistrarAsistencia = ({ onClose, registrar, idTrabajador }: ModalRegistrarAsistenciaProps) => {
  const usuario = localStorage.getItem("usuarioActual");
  console.log("ID del trabajador:", idTrabajador);

  const handleRegistrarAsistencia = () => {
    registrar(true); // ✅ delega al componente padre
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-contenido asistencia" onClick={(e) => e.stopPropagation()}>
        <div className="modal-navbar">
          <img src={logo} alt="Logo" className="modal-logo" />
        </div>

        <h2>¡Hola, {usuario}!</h2>
        <p>¿Deseas registrar tu asistencia?</p>

        <div className="modal-botones">
          <button className="btn-confirmar" onClick={handleRegistrarAsistencia}>
            Registrar
          </button>
          <button className="btn-cancelar" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalRegistrarAsistencia;
