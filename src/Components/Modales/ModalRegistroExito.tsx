import React from "react";
import "../../Styles/Modales/ModalRegistroExitoso.css";
import logo from "../../assets/Logos/logo.png";

interface ModalRegistroExitoProps {
    isOpen: boolean;
    onClose: () => void;
    mensaje: string;
    titulo: string; // Nuevo prop
}

const ModalRegistroExito: React.FC<ModalRegistroExitoProps> = ({ isOpen, onClose, mensaje, titulo }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-exito-overlay" onClick={onClose}>
            <div className="modal-exito-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-exito-navbar">
                    <img src={logo} alt="Logo" className="modal-exito-logo" />
                </div>
                <div className="modal-exito-body">
                    <h2 className="modal-exito-titulo">{titulo}</h2> {/* Ahora dinámico */}
                    <p className="modal-exito-texto">{mensaje}</p>
                    <div className="modal-exito-botones">
                        <button className="modal-exito-confirmar" onClick={onClose}>
                            Aceptar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalRegistroExito;

