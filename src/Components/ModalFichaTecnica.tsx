// src/Components/ModalFichaTecnica.tsx
import { useEffect, useState } from "react";

import logo from "../assets/Logos/logo.png";
import "../Styles/Modales/ModalFichaTecnica.css";

interface FichaTecnica {
    id: number;
    observaciones: string;
    diagnosticoInicial: string;
    servicios: string;
    repuestos: string;
    estado: string;
    idVehiculo: number;
    placaVehiculo: string;
    marcaVehiculo: string;
    colorVehiculo: string;
    nombreCliente: string;
    fingreso: string;
    fsalida: string;
}

interface ModalFichaTecnicaProps {
    isOpen: boolean;
    onClose: () => void;
    onRegistroExitoso?: () => void;
    fichaEditar?: FichaTecnica | null;
}

const ModalFichaTecnica = ({ isOpen, onClose, onRegistroExitoso, fichaEditar }: ModalFichaTecnicaProps) => {
    const [clientes, setClientes] = useState<any[]>([]);
    const [vehiculos, setVehiculos] = useState<any[]>([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState<any>(null);
    const [vehiculosCliente, setVehiculosCliente] = useState<any[]>([]);
    const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<any>(null);

    const [observaciones, setObservaciones] = useState("");
    const [diagnostico, setDiagnostico] = useState("");
    const [repuestosActivo, setRepuestosActivo] = useState(false);
    const [repuestos, setRepuestos] = useState("");
    const [fechaSalida, setFechaSalida] = useState("");
    const [estado, setEstado] = useState("En reparación");

    const [otroServicioActivo, setOtroServicioActivo] = useState(false);
    const [otroServicioTexto, setOtroServicioTexto] = useState("");
    const [servicios, setServicios] = useState<string[]>([]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            fetch("http://localhost:8080/api/clientes")
                .then((res) => res.json())
                .then(setClientes)
                .catch(console.error);

            fetch("http://localhost:8080/api/vehiculos")
                .then((res) => res.json())
                .then(setVehiculos)
                .catch(console.error);
        }
    }, [isOpen]);

    useEffect(() => {
        if (
            fichaEditar &&
            clientes.length > 0 &&
            vehiculos.length > 0
        ) {
            setObservaciones(fichaEditar.observaciones || "");
            setDiagnostico(fichaEditar.diagnosticoInicial || "");

            const serviciosLista = fichaEditar.servicios?.split(",").map(s => s.trim()) || [];
            setServicios(serviciosLista);
            const otroServicio = serviciosLista.find(s =>
                !['Cambio de aceite', 'Revisión general', 'Alineación y balanceo'].includes(s)
            );
            if (otroServicio) {
                setOtroServicioActivo(true);
                setOtroServicioTexto(otroServicio);
            }

            setRepuestos(fichaEditar.repuestos || "");
            setRepuestosActivo(!!fichaEditar.repuestos);
            setFechaSalida(fichaEditar.fsalida || "");

            // Setear estado traducido
            setEstado(
                fichaEditar.estado === "EN_ESPERA" ? "En espera" :
                    fichaEditar.estado === "TERMINADO" ? "Terminado" :
                        "En reparación"
            );

            // Buscar vehículo y cliente relacionados
            const vehiculo = vehiculos.find(v => v.id === fichaEditar.idVehiculo);
            if (vehiculo) {
                setVehiculoSeleccionado(vehiculo);
                const cliente = clientes.find(c => c.id === vehiculo.idCliente);
                if (cliente) {
                    setClienteSeleccionado(cliente);
                    const filtrados = vehiculos.filter(v => v.idCliente === cliente.id);
                    setVehiculosCliente(filtrados);
                }
            }
        }
    }, [fichaEditar, clientes, vehiculos]);


    const handleClienteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        const cliente = clientes.find((c) => c.id.toString() === id);
        setClienteSeleccionado(cliente);

        const filtrados = vehiculos.filter((v) => v.idCliente.toString() === id);
        setVehiculosCliente(filtrados);
        setVehiculoSeleccionado(null);
    };

    const handleVehiculoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const placa = e.target.value;
        const vehiculo = vehiculosCliente.find((v) => v.placa === placa);
        setVehiculoSeleccionado(vehiculo);
    };

    const toggleServicio = (servicio: string) => {
        setServicios((prev) =>
            prev.includes(servicio) ? prev.filter((s) => s !== servicio) : [...prev, servicio]
        );
    };

    const guardarFichaTecnica = async () => {
        if (!vehiculoSeleccionado) {
            return alert("Selecciona un vehículo antes de guardar.");
        }

        const estadoMap: Record<string, string> = {
            "En espera": "EN_ESPERA",
            "Terminado": "TERMINADO",
            "En reparación": "EN_REPARACION"
        };

        const ficha = {
            idVehiculo: vehiculoSeleccionado.id,
            observaciones: observaciones || "Sin observaciones",
            diagnosticoInicial: diagnostico || "Sin diagnóstico",
            servicios: [
                ...servicios.filter(s => ['Cambio de aceite', 'Revisión general', 'Alineación y balanceo'].includes(s)),
                ...(otroServicioActivo && otroServicioTexto.trim() ? [otroServicioTexto] : []),
            ].join(", "),
            repuestos: repuestosActivo ? repuestos : "",
            fIngreso: new Date().toISOString().split("T")[0],
            fSalida: fechaSalida || new Date().toISOString().split("T")[0],
            estado: estadoMap[estado] || "EN_REPARACION"
        };

        const url = fichaEditar ? `http://localhost:8080/api/fichas-tecnicas/${fichaEditar.id}` : "http://localhost:8080/api/fichas-tecnicas";
        const metodo = fichaEditar ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method: metodo,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(ficha)
            });

            if (!res.ok) {
                const error = await res.text();
                throw new Error(error);
            }

            alert(fichaEditar ? "Ficha actualizada con éxito." : "Ficha registrada con éxito.");
            onClose();
            onRegistroExitoso?.();
        } catch (err: any) {
            console.error("Error al guardar ficha:", err.message);
            alert("Error al registrar la ficha técnica: " + err.message);
        }
    };

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
                        <div className="form-section">
                            <h3>Cliente</h3>
                            <label>Seleccionar cliente</label>
                            <select onChange={handleClienteChange} value={clienteSeleccionado?.id || ""}>
                                <option value="">-- Selecciona un cliente --</option>
                                {clientes.map((cliente) => (
                                    <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
                                ))}
                            </select>

                            <label>DNI / RUC</label>
                            <input type="text" disabled value={clienteSeleccionado?.dni || ""} />

                            <h3>Vehículo</h3>
                            <label>Seleccionar vehículo</label>
                            <select onChange={handleVehiculoChange} value={vehiculoSeleccionado?.placa || ""}>
                                <option value="">-- Selecciona un vehículo --</option>
                                {vehiculosCliente.map((v) => (
                                    <option key={v.id} value={v.placa}>{v.placa}</option>
                                ))}
                            </select>

                            <label>Marca</label>
                            <input type="text" disabled value={vehiculoSeleccionado?.marca || ""} />

                            <label>Color</label>
                            <input type="text" disabled value={vehiculoSeleccionado?.color || ""} />

                            <label>Observaciones</label>
                            <textarea placeholder="Observaciones" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
                        </div>

                        <div className="form-section">
                            <h3>Detalles</h3>
                            <label>Diagnóstico inicial</label>
                            <textarea placeholder="Descripción del diagnóstico inicial..." value={diagnostico} onChange={(e) => setDiagnostico(e.target.value)} />

                            <label>Servicios/Reparaciones</label>
                            <div className="servicios-checkboxes">
                                {['Cambio de aceite', 'Revisión general', 'Alineación y balanceo'].map(servicio => (
                                    <label className="checkbox-linea" key={servicio}>
                                        <input
                                            type="checkbox"
                                            checked={servicios.includes(servicio)}
                                            onChange={() => toggleServicio(servicio)}
                                        />
                                        {servicio}
                                    </label>
                                ))}
                                <label className="checkbox-linea">
                                    <input
                                        type="checkbox"
                                        checked={otroServicioActivo}
                                        onChange={(e) => setOtroServicioActivo(e.target.checked)}
                                    />
                                    Otro:
                                    <input
                                        type="text"
                                        placeholder="Especificar otro servicio"
                                        value={otroServicioTexto}
                                        disabled={!otroServicioActivo}
                                        onChange={(e) => setOtroServicioTexto(e.target.value)}
                                    />
                                </label>
                            </div>

                            <div className="repuesto-checkbox">
                                <label>¿Agregar repuestos?</label>
                                <input
                                    type="checkbox"
                                    checked={repuestosActivo}
                                    onChange={(e) => setRepuestosActivo(e.target.checked)}
                                />
                            </div>
                            <textarea
                                placeholder="Especificar repuestos necesarios..."
                                disabled={!repuestosActivo}
                                value={repuestos}
                                onChange={(e) => setRepuestos(e.target.value)}
                            />

                            <label>Fecha estimada de salida</label>
                            <input
                                type="date"
                                value={fechaSalida}
                                onChange={(e) => setFechaSalida(e.target.value)}
                            />

                            <label>Estado</label>
                            <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                                <option>En reparación</option>
                                <option>En espera</option>
                                <option>Terminado</option>
                            </select>
                        </div>
                    </div>

                    <button className="boton-enviar" onClick={guardarFichaTecnica}>
                        {fichaEditar ? "Actualizar ficha" : "Guardar ficha"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalFichaTecnica;
