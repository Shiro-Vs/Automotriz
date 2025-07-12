// src/Pages/Citas.tsx

import '../Styles/Vehiculos.css';
import Modal from '../Components/ModalNuevoVehiculo';
import ModalEliminar from "../Components/ModalEliminar";


import { FaEdit, FaTrash } from 'react-icons/fa';
import { useState } from 'react';

const Citas = () => {

    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);

    return (
        <div className="pagina-citas">
            <div className="encabezado-citas">
                <h1 className="titulo-citas">Vehículos</h1>
                <button className="boton-agendar" onClick={() => setModalAbierto(true)}>
                    Ingresar Vehiculo
                </button>
            </div>

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
                        <tr>
                            <td>ABC-123</td>
                            <td>Toyota</td>
                            <td>Corolla</td>
                            <td>2020</td>
                            <td>Rojo</td>
                            <td>Juan Pérez</td>
                            <td>2025-07-06</td>
                            <td>
                                <button className="boton-editar" onClick={() => setModalAbierto(true)}><FaEdit /></button>
                            </td>
                            <td>
                                <button className="boton-eliminar" onClick={() => setModalEliminarAbierto(true)}><FaTrash /></button>
                            </td>
                        </tr>
                        <tr>
                            <td>XYZ-789</td>
                            <td>Hyundai</td>
                            <td>Elantra</td>
                            <td>2019</td>
                            <td>Azul</td>
                            <td>María López</td>
                            <td>2025-07-10</td>
                            <td>
                                <button className="boton-editar"><FaEdit /></button>
                            </td>
                            <td>
                                <button className="boton-eliminar"><FaTrash /></button>
                            </td>
                        </tr>
                        <tr>
                            <td>MNO-456</td>
                            <td>Kia</td>
                            <td>Sportage</td>
                            <td>2022</td>
                            <td>Negro</td>
                            <td>Carlos Ruiz</td>
                            <td>2025-07-11</td>
                            <td>
                                <button className="boton-editar"><FaEdit /></button>
                            </td>
                            <td>
                                <button className="boton-eliminar"><FaTrash /></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
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
