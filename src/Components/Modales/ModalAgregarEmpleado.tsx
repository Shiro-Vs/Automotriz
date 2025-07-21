import { useEffect, useState, useCallback } from 'react';
import logo from '../../assets/Logos/Logo.png';
import '../../Styles/Modales/ModalNuevoVehiculo.css';
import FormatoInputs from "../FormatoInputs";
import InputFechas from '../InputFechas';

// Tipos de props
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    modo: 'registrar' | 'editar';
    trabajadorSeleccionado?: Trabajador | null;
    empleadosExistentes: Trabajador[];
    onEmpleadoRegistrado?: (modo: "registrado" | "editado") => void;
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
    trabajadorSeleccionado,
    empleadosExistentes,
    onEmpleadoRegistrado,
}: ModalProps) => {

    // Estado inicial del formulario
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
    const [errorDni, setErrorDni] = useState('');
    const [fechaIngresoDate, setFechaIngresoDate] = useState<Date | null>(null);
    const [fechaRetiroDate, setFechaRetiroDate] = useState<Date | null>(null);

    const [validInputs, setValidInputs] = useState({
        dni: true,
        celular: true,
        email: true,
    });

    // Carga de datos al abrir el modal en modo edición
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
        setErrorDni('');
    }, [modo, trabajadorSeleccionado]);

    useEffect(() => {
        if (modo === 'editar' && trabajadorSeleccionado) {
            setFechaIngresoDate(new Date(trabajadorSeleccionado.fechaIngreso));
            setFechaRetiroDate(trabajadorSeleccionado.fechaRetiro ? new Date(trabajadorSeleccionado.fechaRetiro) : null);
        } else {
            setFechaIngresoDate(null);
            setFechaRetiroDate(null);
        }
    }, [modo, trabajadorSeleccionado]);


    // Cierra el modal al presionar la tecla Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Manejadores de cambio para inputs
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

    // Manejadores de validación de campos
    const handleValidoChange = useCallback((campo: keyof typeof validInputs, valido: boolean) => {
        setValidInputs((prev) => ({ ...prev, [campo]: valido }));
    }, []);

    const handleValidoChangeDni = useCallback((valido: boolean) => {
        handleValidoChange('dni', valido);
    }, [handleValidoChange]);

    const handleValidoChangeCelular = useCallback((valido: boolean) => {
        handleValidoChange('celular', valido);
    }, [handleValidoChange]);

    const handleValidoChangeEmail = useCallback((valido: boolean) => {
        handleValidoChange('email', valido);
    }, [handleValidoChange]);

    const handleFechaIngresoChange = (fecha: Date | null) => {
        setFechaIngresoDate(fecha);
        setForm((prev) => ({ ...prev, fechaIngreso: fecha ? fecha.toISOString().split("T")[0] : '' }));
    };

    const handleFechaRetiroChange = (fecha: Date | null) => {
        setFechaRetiroDate(fecha);
        setForm((prev) => ({ ...prev, fechaRetiro: fecha ? fecha.toISOString().split("T")[0] : '' }));
    };

    // Envío del formulario
    const handleSubmit = async () => {
        setErrorDni('');

        const camposObligatorios = ['nombre', 'dni', 'celular', 'fechaIngreso'];
        const camposVacios = camposObligatorios.filter(
            campo => String(form[campo as keyof typeof form]).trim() === ''
        );

        if (modo === 'registrar' && !form.contrasenia.trim()) {
            camposVacios.push('contrasenia');
        }

        if (camposVacios.length > 0) {
            alert('Por favor completa los siguientes campos obligatorios:\n' + camposVacios.join(', '));
            return;
        }

        if (!validInputs.dni || !validInputs.celular || !validInputs.email) {
            alert('Por favor corrige los campos con formato inválido.');
            return;
        }

        if (retirado && !form.fechaRetiro) {
            alert('Debes ingresar la fecha de retiro.');
            return;
        }

        if (modo === 'registrar' || (modo === 'editar' && form.dni !== trabajadorSeleccionado?.dni)) {
            const dniExiste = empleadosExistentes.some(emp => emp.dni === form.dni.trim());
            if (dniExiste) {
                setErrorDni('El DNI ingresado ya está registrado.');
                return;
            }
        }

        try {
            const body: any = {
                ...form,
                fechaRetiro: retirado ? form.fechaRetiro : null,
                estado: !retirado
            };

            if (modo === "editar" && form.contrasenia.trim() === "") {
                delete body.contrasenia;
            }

            const url = modo === 'editar' && trabajadorSeleccionado
                ? `${import.meta.env.VITE_API_URL}/trabajadores/${trabajadorSeleccionado.id}`
                : '${import.meta.env.VITE_API_URL}/trabajadores';

            const method = modo === 'editar' ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                onEmpleadoRegistrado?.(modo === 'registrar' ? 'registrado' : 'editado'); // pasa "registrar" o "editar"
                onClose();
            } else {
                const error = await res.text();
                alert(`Error: ${error}`);
            }

        } catch (err) {
            console.error('Error al registrar/editar trabajador:', err);
            alert('Ocurrió un error. Inténtalo nuevamente.');
        }
    };

    // Si el modal no está abierto, no se renderiza
    if (!isOpen) return null;

    // Renderizado del componente modal
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
                            <FormatoInputs
                                tipo="dni"
                                valor={form.dni}
                                onChange={(valor) => {
                                    setForm((prev) => ({ ...prev, dni: valor }));
                                    setErrorDni('');
                                }}
                                onValidoChange={handleValidoChangeDni}
                                placeholder="12345678"
                                mensajeErrorExtra={errorDni}
                            />

                            <label>Teléfono</label>
                            <FormatoInputs
                                tipo="telefono"
                                valor={form.celular}
                                onChange={(valor) => setForm((prev) => ({ ...prev, celular: valor }))}
                                onValidoChange={handleValidoChangeCelular}
                                placeholder="999 999 999"
                            />

                            <label>Email</label>
                            <FormatoInputs
                                tipo="email"
                                valor={form.email}
                                onChange={(valor) => setForm((prev) => ({ ...prev, email: valor }))}
                                onValidoChange={handleValidoChangeEmail}
                                placeholder="ejemplo@correo.com"
                            />

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
                            <InputFechas
                                fecha={fechaIngresoDate}
                                onChange={handleFechaIngresoChange}
                                placeholder="dd/mm/aaaa"
                            />


                            <label>Rol</label>
                            <select name="rol" value={form.rol} onChange={handleChange}>
                                <option value="Mecánico">Mecánico</option>
                                <option value="Administrador">Administrador</option>
                            </select>

                            <div className="estado-retiro">
                                <label className="estado-label">¿Empleado retirado?</label>
                                <input type="checkbox" checked={retirado} onChange={handleCheckboxChange} />
                            </div>

                            {retirado && (
                                <div className="fecha-retiro">
                                    <label>Fecha de retiro</label>
                                    <InputFechas
                                        fecha={fechaRetiroDate}
                                        onChange={handleFechaRetiroChange}
                                        placeholder="dd/mm/aaaa"
                                    />
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
