// src/Components/ModalFichaTecnica.tsx
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import logo from "../assets/Logos/logo.png";
import "../Styles/ModalAgendarCita.css"; // Reutiliza los estilos del otro modal

interface ModalFichaTecnicaProps {
    isOpen: boolean;
    onClose: () => void;
    children?: ReactNode;
}

const [repuestosActivo, setRepuestosActivo] = useState(false);

const ModalFichaTecnica = ({ isOpen, onClose }: ModalFichaTecnicaProps) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-navbar">
                    <img src={logo} alt="Logo" className="modal-logo" />
                </div>

                <div className="modal-body">
                    <h2 className="modal-titulo">Ficha Técnica</h2>

                    <div className="formulario-columns">
                        <div className="formulario-columns">
                            {/* 🧍 Columna izquierda - Cliente y Vehículo */}
                            <div className="form-section">
                                <h3>Cliente</h3>
                                <label>Seleccionar cliente</label>
                                <select>
                                    <option>-- Selecciona un cliente --</option>
                                    <option>Juan Pérez</option>
                                    <option>Empresa SAC</option>
                                </select>

                                <label>DNI / RUC</label>
                                <input type="text" disabled placeholder="Se llenará automáticamente" />

                                <h3>Vehículo</h3>
                                <label>Seleccionar vehículo</label>
                                <select>
                                    <option>-- Selecciona un vehículo --</option>
                                    <option>ABC-123</option>
                                    <option>XYZ-456</option>
                                </select>

                                <label>Marca</label>
                                <input type="text" disabled placeholder="Marca" />

                                <label>Modelo</label>
                                <input type="text" disabled placeholder="Modelo" />

                                <label>Color</label>
                                <input type="text" disabled placeholder="Color" />

                                <label>Observaciones</label>
                                <textarea disabled placeholder="Observaciones" />
                            </div>

                            {/* 🔧 Columna derecha - Diagnóstico y Servicios */}
                            <div className="form-section">
                                <label>Diagnóstico inicial</label>
                                <textarea placeholder="Descripción del diagnóstico inicial..." />

                                <label>Servicios/Reparaciones</label>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                    <label><input type="checkbox" /> Cambio de aceite</label>
                                    <label><input type="checkbox" /> Cambio de frenos</label>
                                    <label><input type="checkbox" /> Revisión general</label>
                                    <label><input type="checkbox" /> Alineación y balanceo</label>
                                    <label><input type="checkbox" /> Sistema eléctrico</label>
                                    <label>
                                        <input type="checkbox" /> Otro:
                                        <input type="text" placeholder="Especificar otro servicio" style={{ marginLeft: "0.5rem" }} />
                                    </label>
                                </div>

                                <label>
                                    <input
                                        type="checkbox"
                                        onChange={(e) => setRepuestosActivo(e.target.checked)}
                                    /> ¿Agregar repuestos?
                                </label>
                                <textarea
                                    placeholder="Especificar repuestos necesarios..."
                                    disabled={!repuestosActivo}
                                />

                                <label>Fecha estimada de salida</label>
                                <input type="date" />

                                <label>Estado</label>
                                <select>
                                    <option>En reparación</option>
                                    <option>En espera</option>
                                    <option>Terminado</option>
                                    <option>Listo para entrega</option>
                                    <option>Entregado</option>
                                </select>
                            </div>
                        </div>

                    </div>

                    <button className="boton-enviar">Guardar ficha</button>
                </div>
            </div>
        </div>
    );
};

export default ModalFichaTecnica;
