// 📁 src/Components/Modales/ModalRegistrarAsistencia.tsx

import '../../Styles/Modales/ModalRegistrarAsistencia.css'; // usa tu estilo base o crea uno nuevo
import logo from '../../assets/Logos/Logo.png'; // actualiza la ruta según corresponda

interface Props {
  onClose: () => void;
}

const ModalRegistrarAsistencia = ({ onClose }: Props) => {
  const usuario = localStorage.getItem("usuarioActual");

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-contenido asistencia" onClick={(e) => e.stopPropagation()}>
        {/* 🖼️ Logo */}
        <div className="modal-navbar">
          <img src={logo} alt="Logo" className="modal-logo" />
        </div>

        {/* ✍️ Mensaje de bienvenida */}
        <h2>¡Hola, {usuario}!</h2>
        <p>¿Deseas registrar tu asistencia?</p>

        {/* ✅ Botones */}
        <div className="modal-botones">
          <button
            className="btn-confirmar"
            onClick={() => {
              // Aquí podrías hacer una petición POST de asistencia
              alert("Asistencia registrada correctamente ✅");
              onClose();
            }}
          >
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
