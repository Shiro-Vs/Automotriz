import { useEffect, useState } from 'react';

import logo from '../assets/Logos/logo.png';

import '../Styles/Modales/ModalNuevoVehiculo.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    modo: 'registrar' | 'editar';
    trabajadorSeleccionado?: Trabajador | null;
}

interface Trabajador {
    id: number;
    nombre: string;
    dni: string;
    celular: string;
    email: string;
    direccion: string;
    contrasenia: string;
    fechaIngreso: string;
    fechaRetiro: string | null;
    estado: boolean;
    rol: string;
}

const ModalNuevoEmpleado = ({
    isOpen,
    onClose,
    modo,
    trabajadorSeleccionado
}: ModalProps) => {
    const [form, setForm] = useState({
        nombre: '',
        dni: '',
        celular: '',
        email: '',
        direccion: '',
        contrasenia: '',
        fechaIngreso: '',
        fechaRetiro: '',
        estado: true,
        rol: 'EMPLEADO',
    });

    const [retirado, setRetirado] = useState(false);

    useEffect(() => {
        if (modo === 'editar' && trabajadorSeleccionado) {
            setForm({
                nombre: trabajadorSeleccionado.nombre,
                dni: trabajadorSeleccionado.dni,
                celular: trabajadorSeleccionado.celular,
                email: trabajadorSeleccionado.email,
                direccion: trabajadorSeleccionado.direccion,
                contrasenia: '',
                fechaIngreso: trabajadorSeleccionado.fechaIngreso,
                fechaRetiro: trabajadorSeleccionado.fechaRetiro || '',
                estado: trabajadorSeleccionado.estado,
                rol: trabajadorSeleccionado.rol,
            });
            setRetirado(!trabajadorSeleccionado.estado);
        } else {
            setForm({
                nombre: '',
                dni: '',
                celular: '',
                email: '',
                direccion: '',
                contrasenia: '',
                fechaIngreso: '',
                fechaRetiro: '',
                estado: true,
                rol: 'EMPLEADO',
            });
            setRetirado(false);
        }
    }, [modo, trabajadorSeleccionado]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = () => {
        const nuevoRetirado = !retirado;
        setRetirado(nuevoRetirado);
        setForm((prev) => ({
            ...prev,
            estado: !nuevoRetirado,
            fechaRetiro: nuevoRetirado ? '' : ''
        }));
    };

    const handleRetiroDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, fechaRetiro: e.target.value }));
    };

    const handleSubmit = async () => {
        if (retirado && !form.fechaRetiro) {
            alert('Debes ingresar la fecha de retiro.');
            return;
        }

        try {
            let body: any = {
                ...form,
                fechaRetiro: retirado ? form.fechaRetiro : null,
                estado: !retirado
            };

            if (modo === "editar" && form.contrasenia.trim() === "") {
                delete body.contrasenia;
            }

            const url =
                modo === 'editar' && trabajadorSeleccionado
                    ? `http://localhost:8080/api/trabajadores/${trabajadorSeleccionado.id}`
                    : 'http://localhost:8080/api/trabajadores';

            const method = modo === 'editar' ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const result = await res.text();
            alert(result);
            onClose();
        } catch (err) {
            console.error('Error al registrar/editar trabajador:', err);
            alert('Ocurrió un error. Inténtalo nuevamente.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
                <div className="modal-navbar">
                    <img src={logo} alt="Logo" className="modal-logo" />
                </div>

                <div className="modal-body">
                    <h2 className="modal-titulo">
                        {modo === 'editar' ? 'Editar empleado' : 'Registrar nuevo empleado'}
                    </h2>

                    <div className="formulario-columns">
                        <div className="form-section">
                            <label>Nombre completo</label>
                            <input name="nombre" type="text" value={form.nombre} onChange={handleChange} required />

                            <label>DNI</label>
                            <input name="dni" type="text" value={form.dni} onChange={handleChange} required />

                            <label>Teléfono</label>
                            <input name="celular" type="text" value={form.celular} onChange={handleChange} required />

                            <label>Email</label>
                            <input name="email" type="email" value={form.email} onChange={handleChange} required />

                            <label>Dirección</label>
                            <input name="direccion" type="text" value={form.direccion} onChange={handleChange} required />

                            <label>Contraseña</label>
                            <input
                                name="contrasenia"
                                type="password"
                                value={form.contrasenia}
                                onChange={handleChange}
                                placeholder={modo === 'editar' ? 'Dejar en blanco para mantener la actual' : '********'}
                                required={modo === 'registrar'}
                            />

                            <label>Fecha de ingreso</label>
                            <input name="fechaIngreso" type="date" value={form.fechaIngreso} onChange={handleChange} required />

                            <label>Rol</label>
                            <select name="rol" value={form.rol} onChange={handleChange}>
                                <option value="MECANICO">Mecánico</option>
                                <option value="ADMIN">Administrador</option>
                            </select>

                            <div className="estado-retiro">
                                <label className="estado-label">¿Empleado retirado?</label>
                                <input type="checkbox" checked={retirado} onChange={handleCheckboxChange} />
                            </div>

                            {retirado && (
                                <div className="fecha-retiro">
                                    <label>Fecha de retiro</label>
                                    <input type="date" value={form.fechaRetiro} onChange={handleRetiroDateChange} required />
                                </div>
                            )}
                        </div>
                    </div>

                    <button className="boton-enviar" onClick={handleSubmit}>
                        {modo === 'editar' ? 'Guardar Cambios' : 'Registrar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalNuevoEmpleado;
