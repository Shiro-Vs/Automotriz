import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import logo from '../assets/Logos/logo.png';
import '../Styles/Modales/ModalNuevoVehiculo.css'; // ✅ reutilizamos el mismo CSS

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children?: ReactNode;
}

const ModalNuevoEmpleado = ({ isOpen, onClose }: ModalProps) => {

    const [retirado, setRetirado] = useState(false);
    // 
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
            <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>

                {/* Barra superior */}
                <div className="modal-navbar">
                    <img src={logo} alt="Logo" className="modal-logo" />
                </div>

                <div className="modal-body">
                    <h2 className="modal-titulo">Registrar nuevo empleado</h2>

                    <div className="formulario-columns">
                        <div className="form-section">
                            <label>Nombre completo</label>
                            <input type="text" placeholder="Ej: María López" />

                            <label>DNI</label>
                            <input type="text" placeholder="12345678" />

                            <label>Teléfono</label>
                            <input type="text" placeholder="987654321" />

                            <label>Email</label>
                            <input type="email" placeholder="empleado@taller.com" />

                            <label>Dirección</label>
                            <input type="text" placeholder="Av. Siempre Viva 742" />

                            <label>Contraseña</label>
                            <input type="password" placeholder="********" />

                            <div className="estado-retiro">
                                <label className="estado-label">¿Empleado retirado?</label>
                                <input
                                    type="checkbox"
                                    checked={retirado}
                                    onChange={() => setRetirado(!retirado)}
                                />
                            </div>

                            {retirado && (
                                <div className="fecha-retiro">
                                    <label>Fecha de retiro</label>
                                    <input type="date" />
                                </div>
                            )}
                        </div>
                    </div>

                    <button className="boton-enviar">Registrar</button>
                </div>
            </div>
        </div>
    );
};

export default ModalNuevoEmpleado;
