// ModalErrorInicioSesion.tsx
import '../../Styles/Modales/ModalError.css';
import logo from '../../assets/Logos/logo.png'; // ✅ Usa tu logo aquí

interface Props {
  onClose: () => void;
}

const ModalErrorInicioSesion = ({ onClose }: Props) => {
  return (
    <div className="modal-error-overlay">
      <div className="modal-error-content">
        {/* 🔴 Barra superior */}
        <div className="modal-error-navbar">
          <img src={logo} alt="Logo" className="modal-error-logo" />
        </div>

        {/* 📄 Cuerpo */}
        <div className="modal-error-body">
          <p className="modal-error-texto">
            Usuario o contraseña incorrectos. <br />
            Verifica tus credenciales e intenta nuevamente.
          </p>

          {/* ❌ Botón cerrar */}
          <div className="modal-error-botones">
            <button className="modal-error-cerrar" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalErrorInicioSesion;
