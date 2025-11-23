// 📦 Dependencias
import { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

// 🎨 Estilos
import '../Styles/General.css';
import '../Styles/Componentes/Tablas.css';
import '../Styles/Componentes/Filtros.css';

// 🧩 Componentes
import Modal from '../Components/Modales/ModalNuevoVehiculo';
import ModalEliminar from '../Components/Modales/ModalEliminar';
import ModalEditarClienteVehiculo from '../Components/Modales/ModalEditarClienteVehiculo';
import Filtros from '../Components/Filtros';
import ModalExito from "../Components/Modales/ModalRegistroExito";

// 🪝 Hooks & Types
import { useVehiculos } from '../hooks/useVehiculos';
import type { Vehiculo } from '../types';

const Vehiculos = () => {
  // 🪝 Hook personalizado
  const {
    vehiculos, // Ya vienen filtrados
    filtros,
    actualizarFiltro,
    limpiarFiltros,
    agregarVehiculo,
    editarVehiculo,
    eliminarVehiculo
  } = useVehiculos();

  // 🚘 Estados locales UI (modales y selección)
  const [vehiculoSeleccionadoId, setVehiculoSeleccionadoId] = useState<number | null>(null);
  const [vehiculoEditando, setVehiculoEditando] = useState<Vehiculo>({
    id: 0, placa: '', marca: '', modelo: '', anio: 0,
    color: '', fechaRegistro: '', idCliente: 0, nombreCliente: ''
  });

  // 💬 Estados - Modales
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalExitoAbierto, setModalExitoAbierto] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [tituloExito, setTituloExito] = useState("");

  // ➕ Registrar vehículo
  const handleRegistrar = async (vehiculo: any) => {
    try {
      await agregarVehiculo(vehiculo);
      setModalAbierto(false);
      setMensajeExito("Vehículo registrado correctamente.");
      setTituloExito("¡Registro Exitoso!");
      setModalExitoAbierto(true);
    } catch (error) {
      alert('Error al registrar vehículo');
    }
  };

  // 🖊️ Editar vehículo
  const handleEditarVehiculo = (vehiculo: Vehiculo) => {
    setVehiculoEditando(vehiculo);
    setModalEditarAbierto(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVehiculoEditando(prev => ({
      ...prev,
      [name]: name === 'anio' ? Number(value) : value
    }));
  };

  const guardarCambiosVehiculo = async () => {
    try {
      await editarVehiculo(vehiculoEditando.id, vehiculoEditando);
      setMensajeExito('Vehículo editado correctamente.');
      setTituloExito("¡Edición Exitosa!");
      setModalExitoAbierto(true);
      setModalEditarAbierto(false);
    } catch (error) {
      alert('Error al actualizar vehículo');
    }
  };

  // ❌ Eliminar vehículo
  const handleEliminar = async () => {
    if (vehiculoSeleccionadoId === null) return;
    try {
      await eliminarVehiculo(vehiculoSeleccionadoId);
      setVehiculoSeleccionadoId(null);
      setModalEliminarAbierto(false);
    } catch (error) {
      alert('Error al eliminar vehículo');
    }
  };

  // 📤 Exportar vehículos
  const exportarVehiculos = () => {
    console.log('Exportando vehículos filtrados...');
  };

  // 🧱 Render
  return (
    <div className="pagina-citas">
      {/* Encabezado */}
      <div className="encabezado-citas">
        <h1 className="titulo-citas">Vehículos</h1>
        <button className="boton-agendar" onClick={() => setModalAbierto(true)}>
          Ingresar Vehículo
        </button>
      </div>

      {/* Contenido principal */}
      <div className="contenido-principal">
        {/* Tabla de vehículos */}
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
                  <td>{v.fechaRegistro.split("-").reverse().join("/")}</td>
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

        {/* Filtros reutilizables */}
        <Filtros
          campos={[
            {
              tipo: 'fecha',
              label: 'Fecha desde:',
              value: filtros.fechaDesde ? filtros.fechaDesde.toISOString() : '',
              onChange: v => actualizarFiltro('fechaDesde', v ? new Date(v) : null)
            },
            {
              tipo: 'fecha',
              label: 'Fecha hasta:',
              value: filtros.fechaHasta ? filtros.fechaHasta.toISOString() : '',
              onChange: v => actualizarFiltro('fechaHasta', v ? new Date(v) : null)
            },
            { tipo: 'input', label: 'Marca:', value: filtros.marca, onChange: v => actualizarFiltro('marca', v), placeholder: 'Ej: Toyota' },
            { tipo: 'input', label: 'Modelo:', value: filtros.modelo, onChange: v => actualizarFiltro('modelo', v), placeholder: 'Ej: Corolla' },
            { tipo: 'input', label: 'Dueño:', value: filtros.dueno, onChange: v => actualizarFiltro('dueno', v), placeholder: 'Ej: Maria Suarez' }
          ]}
          onFiltrar={() => {}} // El filtro es automático con el hook
          onExportar={exportarVehiculos}
          onLimpiar={limpiarFiltros}
        />
      </div>

      {/* Modales */}
      <Modal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSubmit={handleRegistrar}
        onExito={(mensaje: string) => {
          setMensajeExito(mensaje);
          setTituloExito("¡Registro Exitoso!");
          setModalExitoAbierto(true);
        }}
      />

      <ModalExito
        isOpen={modalExitoAbierto}
        onClose={() => setModalExitoAbierto(false)}
        mensaje={mensajeExito}
        titulo={tituloExito}
      />


      <ModalEliminar
        isOpen={modalEliminarAbierto}
        onClose={() => setModalEliminarAbierto(false)}
        onConfirm={handleEliminar}
        entidad="el vehículo"
      />

      <ModalEditarClienteVehiculo
        isOpen={modalEditarAbierto}
        onClose={() => setModalEditarAbierto(false)}
        titulo="Editar Vehículo"
        campos={[
          {
            name: 'placa',
            label: 'Placa',
            type: 'text',
            value: vehiculoEditando.placa,
          },
          {
            name: 'marca',
            label: 'Marca',
            type: 'text',
            value: vehiculoEditando.marca,
          },
          {
            name: 'modelo',
            label: 'Modelo',
            type: 'text',
            value: vehiculoEditando.modelo,
          },
          {
            name: 'anio',
            label: 'Año',
            type: 'number',
            value: vehiculoEditando.anio?.toString() || '',
          },
          {
            name: 'color',
            label: 'Color',
            type: 'text',
            value: vehiculoEditando.color,
          },
        ]}
        onChange={handleInputChange}
        onSubmit={guardarCambiosVehiculo}
      />

    </div>
  );
};

export default Vehiculos;
