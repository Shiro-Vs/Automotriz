// src/Pages/Citas.tsx

import '../Styles/Citas.css';
import Modal from '../Components/ModalAgendarCita';
import ModalEliminar from "../Components/ModalEliminar";


import { FaEdit, FaTrash } from 'react-icons/fa';
import { useState } from 'react';

const Citas = () => {

    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);

    return (
        <div className="pagina-citas">
            <div className="encabezado-citas">
                <h1 className="titulo-citas">Citas</h1>
                <button className="boton-agendar" onClick={() => setModalAbierto(true)}>
                    Agendar cita
                </button>
            </div>

            <div className="tabla-contenedor">
                <table className="tabla-citas">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>DNI</th>
                            <th>Placa</th>
                            <th>Color</th>
                            <th>Fecha de ingreso</th>
                            <th>Servicio</th>
                            <th>Observaciones</th>
                            <th>Fecha de término</th>
                            <th>Editar</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* 👇 Ejemplo de fila */}
                        <tr>
                            <td>Juan Pérez</td>
                            <td>43841945</td>
                            <td>ABC-123</td>
                            <td>Rojo</td>
                            <td>2025-07-06</td>
                            <td>Cambio de aceite</td>
                            <td>Ninguna</td>
                            <td>2025-07-07</td>
                            <td>
                                <button className="boton-editar" onClick={() => setModalAbierto(true)}><FaEdit /></button>
                            </td>
                            <td>
                                <button className="boton-eliminar" onClick={() => setModalEliminarAbierto(true)}><FaTrash /></button>
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
