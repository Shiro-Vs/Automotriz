import React from 'react';
import '../../Styles/Modales/ModalError.css';
import logo from '../../assets/Logos/Logo.png'; // Asegúrate de tener este logo

interface ModalErrorProps {
  isOpen: boolean;
  mensaje: string;
  onClose: () => void;
}

const ModalError: React.FC<ModalErrorProps> = ({ isOpen, mensaje, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-error-overlay">
      <div className="modal-error-content">
        <div className="modal-error-navbar">
          <img src={logo} alt="Logo" className="modal-error-logo" />
        </div>
        <div className="modal-error-body">
          <p className="modal-error-texto">{mensaje}</p>
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

export default ModalError;
