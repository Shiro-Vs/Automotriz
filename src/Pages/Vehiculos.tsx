import { useEffect, useState } from 'react';
import '../Styles/Vehiculos.css';
import Modal from '../Components/ModalNuevoVehiculo';
import ModalEliminar from "../Components/ModalEliminar";
import ModalEditarClienteVehiculo from "../Components/ModalEditarClienteVehiculo";
import { FaEdit, FaTrash } from 'react-icons/fa';

interface Vehiculo {
    id: number;
    placa: string;
    marca: string;
    modelo: string;
    anio: number;
    color: string;
    fechaRegistro: string;
    idCliente: number;
    nombreCliente: string;
}

const Citas = () => {
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const [vehiculoSeleccionadoId, setVehiculoSeleccionadoId] = useState<number | null>(null);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
    const [modalEditarAbierto, setModalEditarAbierto] = useState(false);

    const [vehiculoEditando, setVehiculoEditando] = useState<Vehiculo>({
        id: 0,
        placa: '',
        marca: '',
        modelo: '',
        anio: 0,
        color: '',
        fechaRegistro: '',
        idCliente: 0,
        nombreCliente: ''
    });


    const registrarNuevoVehiculo = async (nuevoVehiculo: any) => {
        try {
            const res = await fetch("http://localhost:8080/api/vehiculos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoVehiculo)
            });

            if (res.ok) {
                const vehiculoCreado = await res.json(); // si devuelves el objeto creado
                setVehiculos(prev => [...prev, vehiculoCreado]);
                alert("Vehículo registrado correctamente.");
                setModalAbierto(false);
            } else {
                const errorText = await res.text();
                alert("Error al registrar: " + errorText);
            }
        } catch (error) {
            console.error("Error al registrar vehículo:", error);
            alert("Error inesperado al registrar el vehículo.");
        }
    };

    // Cargar vehículos
    useEffect(() => {
        fetch("http://localhost:8080/api/vehiculos")
            .then(res => res.json())
            .then(data => {
                const formateados = data.map((v: any) => ({
                    ...v,
                    anio: Number(v.anio)
                }));
                setVehiculos(formateados);
            })
            .catch(err => console.error("Error al obtener vehículos:", err));
    }, []);

    // Editar
    const handleEditarVehiculo = (vehiculo: Vehiculo) => {
        setVehiculoEditando(vehiculo);
        setModalEditarAbierto(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setVehiculoEditando(prev => ({
            ...prev,
            [name]: name === "anio" ? Number(value) : value
        }));
    };

    const guardarCambiosVehiculo = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/vehiculos/${vehiculoEditando.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(vehiculoEditando)
            });

            if (res.ok) {
                setVehiculos(prev =>
                    prev.map(v => (v.id === vehiculoEditando.id ? vehiculoEditando : v))
                );
                alert("Vehículo actualizado correctamente.");
                setModalEditarAbierto(false);
            } else {
                const msg = await res.text();
                alert("Error: " + msg);
            }
        } catch (error) {
            console.error("Error al actualizar vehículo:", error);
            alert("Error inesperado al actualizar el vehículo.");
        }
    };

    // Eliminar
    const eliminarVehiculo = async () => {
        if (vehiculoSeleccionadoId === null) return;

        try {
            const res = await fetch(`http://localhost:8080/api/vehiculos/${vehiculoSeleccionadoId}`, {
                method: "DELETE"
            });

            if (res.ok) {
                setVehiculos(prev => prev.filter(v => v.id !== vehiculoSeleccionadoId));
                alert("Vehículo eliminado correctamente.");
            } else {
                const mensaje = await res.text();
                alert("Error: " + mensaje);
            }
        } catch (err) {
            console.error("Error al eliminar vehículo:", err);
            alert("Error inesperado al eliminar el vehículo.");
        } finally {
            setVehiculoSeleccionadoId(null);
            setModalEliminarAbierto(false);
        }
    };

    return (
        <div className="pagina-citas">
            <div className="encabezado-citas">
                <h1 className="titulo-citas">Vehículos</h1>
                <button className="boton-agendar" onClick={() => setModalAbierto(true)}>
                    Ingresar Vehículo
                </button>
            </div>

            <div className="contenido-principal">
                <div className="tabla-contenedor">
                    <table className="tabla-citas">
                        <thead>
                            <tr>
                                <th>Placa</th>
                                <th>Marca</th>
                                <th>Modelo</th>
                                <th>Año</th>
                                <th>Color</th>
                                <th>Dueño</th>
                                <th>Fecha de registro</th>
                                <th>Editar</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehiculos.map(v => (
                                <tr key={v.id}>
                                    <td>{v.placa}</td>
                                    <td>{v.marca}</td>
                                    <td>{v.modelo}</td>
                                    <td>{v.anio}</td>
                                    <td>{v.color}</td>
                                    <td>{v.nombreCliente || 'Sin cliente'}</td>
                                    <td>{v.fechaRegistro}</td>
                                    <td>
                                        <button className="boton-editar" onClick={() => handleEditarVehiculo(v)}>
                                            <FaEdit />
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="boton-eliminar"
                                            onClick={() => {
                                                setVehiculoSeleccionadoId(v.id);
                                                setModalEliminarAbierto(true);
                                            }}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="filtros-contenedor">
                    <h3>Filtros</h3>
                    <label>Fecha desde:</label>
                    <input type="date" />
                    <label>Fecha hasta:</label>
                    <input type="date" />
                    <label>Marca:</label>
                    <input type="text" placeholder="Toyota" />
                    <label>Modelo:</label>
                    <input type="text" placeholder="Corolla" />
                    <label>Año:</label>
                    <input type="text" placeholder="2020" />
                    <label>DNI / RUC:</label>
                    <input type="text" placeholder="12345678 / 20..." />
                    <button className="boton-filtrar">Filtrar</button>
                    <button className="boton-exportar">Exportar Excel</button>
                </div>
            </div>

            <Modal
                isOpen={modalAbierto}
                onClose={() => setModalAbierto(false)}
                onSubmit={registrarNuevoVehiculo}
            />

            <ModalEliminar
                isOpen={modalEliminarAbierto}
                onClose={() => setModalEliminarAbierto(false)}
                onConfirm={eliminarVehiculo}
                entidad="el vehículo"
            />

            <ModalEditarClienteVehiculo
                isOpen={modalEditarAbierto}
                onClose={() => setModalEditarAbierto(false)}
                titulo="Editar Vehículo"
                campos={[
                    { name: 'placa', label: 'Placa', type: 'text', value: vehiculoEditando.placa },
                    { name: 'marca', label: 'Marca', type: 'text', value: vehiculoEditando.marca },
                    { name: 'modelo', label: 'Modelo', type: 'text', value: vehiculoEditando.modelo },
                    { name: 'anio', label: 'Año', type: 'number', value: vehiculoEditando.anio.toString() },
                    { name: 'color', label: 'Color', type: 'text', value: vehiculoEditando.color }
                ]}
                onChange={handleInputChange}
                onSubmit={guardarCambiosVehiculo}
            />
        </div>
    );
};

export default Citas;
