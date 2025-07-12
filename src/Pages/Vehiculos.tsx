// src/Pages/Citas.tsx
import { useEffect, useState } from 'react';

import '../Styles/Vehiculos.css';
import Modal from '../Components/ModalNuevoVehiculo';
import ModalEliminar from "../Components/ModalEliminar";


import { FaEdit, FaTrash } from 'react-icons/fa';

interface Vehiculo {
    id_vehiculo: number;
    placa: string;
    marca: string;
    modelo: string;
    anio: number;
    color: string;
    fechaRegistro: string;
    usuario: {
        nombre: string;
        dni: string;
        celular: string;
    };
}

const Citas = () => {

    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/vehiculos")
            .then(res => res.json())
            .then(data => setVehiculos(data))
            .catch(err => console.error("Error al obtener vehículos:", err));
    }, []);


    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);

    return (
        <div className="pagina-citas">
            <div className="encabezado-citas">
                <h1 className="titulo-citas">Vehículos</h1>
                <button className="boton-agendar" onClick={() => setModalAbierto(true)}>
                    Ingresar Vehículo
                </button>
            </div>

            {/* Contenedor de tabla + filtros en columnas */}
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
                                <tr key={v.id_vehiculo}>
                                    <td>{v.placa}</td>
                                    <td>{v.marca}</td>
                                    <td>{v.modelo}</td>
                                    <td>{v.anio}</td>
                                    <td>{v.color}</td>
                                    <td>{v.usuario?.nombre || 'Sin dueño'}</td>
                                    <td>{v.fechaRegistro}</td>
                                    <td>
                                        <button className="boton-editar"><FaEdit /></button>
                                    </td>
                                    <td>
                                        <button className="boton-eliminar"><FaTrash /></button>
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


            <Modal isOpen={modalAbierto} onClose={() => setModalAbierto(false)}>
                {/* Aquí irá tu formulario en el futuro */}
                <h2>Agendar nueva cita</h2>
                <p>(Aquí irá tu formulario 👇)</p>
            </Modal>

            <ModalEliminar
                isOpen={modalEliminarAbierto}
                onClose={() => setModalEliminarAbierto(false)}
                onConfirm={() => {
                    // Aquí va la lógica para eliminar una cita (más adelante)
                    setModalEliminarAbierto(false);
                }}
            ></ModalEliminar>

        </div>
    );
};

export default Citas;
