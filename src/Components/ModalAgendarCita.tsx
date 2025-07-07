// src/Components/Modal.tsx
import { useEffect } from 'react';
import type { ReactNode } from 'react';

import logo from '../assets/Logos/logo.png';

import '../Styles/ModalAgendarCita.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
<div className="modal-overlay" onClick={onClose}>
  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
    
    {/* Barra superior estilo Navbar */}
    <div className="modal-navbar">
      <img src={logo} alt="Logo" className="modal-logo" />
    </div>

    {/* Contenido principal */}
    <div className="modal-body">
      <h2 className="modal-titulo">Agendar nuevo vehículo</h2>

      <div className="formulario-columns">
        <div className="form-section">
          <h3>Cliente</h3>
          <label>Nombre / Razón Social</label>
          <input type="text" placeholder="Juan Pérez o Empresa SAC" />

          <label>DNI / RUC</label>
          <input type="text" placeholder="12345678 / 20123456789" />
        </div>

        <div className="form-section">
          <h3>Vehículo</h3>
          <label>Marca</label>
          <input type="text" placeholder="Toyota, Hyundai, etc." />

          <label>Placa</label>
          <input type="text" placeholder="ABC-123" />

          <label>Color</label>
          <input type="text" placeholder="Rojo, Azul..." />

          <label>Observaciones</label>
          <textarea placeholder="Especificaciones extra..." />

          <label>Servicio</label>
          <input type="text" placeholder="Cambio de aceite, revisión..." />
        </div>
      </div>

      <button className="boton-enviar">Enviar</button>
    </div>
  </div>
</div>

  );
};

export default Modal;
