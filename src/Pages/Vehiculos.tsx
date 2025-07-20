// 📦 Dependencias
import { useEffect, useState } from 'react';
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

// 🧾 Interfaces
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

const Vehiculos = () => {
  // 🧪 Estados - Formato
  const [anio, setAnio] = useState('');

  // 🎯 Estados - Filtros
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [dueno, setDueno] = useState('');
  const [fechaDesde, setFechaDesde] = useState<Date | null>(null);
  const [fechaHasta, setFechaHasta] = useState<Date | null>(null);

  // 🚘 Estados - Vehículos
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [vehiculosFiltrados, setVehiculosFiltrados] = useState<Vehiculo[]>([]);
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

  // 🧹 Limpiar filtros
  const limpiarFiltros = () => {
    setMarca('');
    setModelo('');
    setAnio('');
    setDueno('');
    setFechaDesde(null);
    setFechaHasta(null);
    setVehiculosFiltrados(vehiculos);
  };

  // ➕ Registrar vehículo
  const registrarNuevoVehiculo = (vehiculo: Vehiculo) => {
    setVehiculos(prev => {
      const actualizados = [...prev, vehiculo];
      setVehiculosFiltrados(actualizados); // 👈 también actualizamos la tabla
      return actualizados;
    });
    setModalAbierto(false);

    // Mostrar modal de éxito si lo deseas aquí
    setMensajeExito("Vehículo registrado correctamente.");
    setTituloExito("¡Registro Exitoso!");
    setModalExitoAbierto(true);
  };

  // 🔁 Obtener vehículos del backend
  useEffect(() => {
    fetch('http://localhost:8080/api/vehiculos')
      .then(res => res.json())
      .then(data => {
        const formateados = data.map((v: any) => ({ ...v, anio: Number(v.anio) }));
        setVehiculos(formateados);
        setVehiculosFiltrados(formateados);
      })
      .catch(err => console.error('Error al obtener vehículos:', err));
  }, []);

  // 🔍 Filtrar vehículos
  const filtrarVehiculos = () => {
    const filtrados = vehiculos.filter(v => {
      const fecha = new Date(v.fechaRegistro);
      return (
        (!fechaDesde || fecha >= fechaDesde) &&
        (!fechaHasta || fecha <= fechaHasta) &&
        (!marca || v.marca.toLowerCase().includes(marca.toLowerCase())) &&
        (!modelo || v.modelo.toLowerCase().includes(modelo.toLowerCase())) &&
        (!anio || v.anio.toString().includes(anio)) &&
        (!dueno || v.nombreCliente.toLowerCase().includes(dueno.toLowerCase()))
      );
    });

    setVehiculosFiltrados(filtrados);
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
      const res = await fetch(`http://localhost:8080/api/vehiculos/${vehiculoEditando.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehiculoEditando)
      });

      if (res.ok) {
        setVehiculos(prev =>
          prev.map(v => (v.id === vehiculoEditando.id ? vehiculoEditando : v))
        );

        // ✅ Mostrar modal de éxito en lugar de alert
        setMensajeExito('Vehículo editado correctamente.');
        setTituloExito("¡Edición Exitosa!");
        setModalExitoAbierto(true);

        setModalEditarAbierto(false);
      } else {
        const msg = await res.text();
        alert('Error: ' + msg);
      }
    } catch (error) {
      console.error('Error al actualizar vehículo:', error);
      alert('Error inesperado al actualizar el vehículo.');
    }
  };


  // ❌ Eliminar vehículo
  const eliminarVehiculo = async () => {
    if (vehiculoSeleccionadoId === null) return;

    try {
      const res = await fetch(`http://localhost:8080/api/vehiculos/${vehiculoSeleccionadoId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        // ✅ Actualizar ambos estados
        setVehiculos(prev => {
          const actualizados = prev.filter(v => v.id !== vehiculoSeleccionadoId);
          setVehiculosFiltrados(actualizados); // 👈 Esto refresca la tabla
          return actualizados;
        });
      } else {
        const mensaje = await res.text();
        alert('Error: ' + mensaje);
      }
    } catch (err) {
      console.error('Error al eliminar vehículo:', err);
      alert('Error inesperado al eliminar el vehículo.');
    } finally {
      setVehiculoSeleccionadoId(null);
      setModalEliminarAbierto(false);
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
              {vehiculosFiltrados.map(v => (
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
              value: fechaDesde ? fechaDesde.toISOString() : '',
              onChange: v => setFechaDesde(v ? new Date(v) : null)
            },
            {
              tipo: 'fecha',
              label: 'Fecha hasta:',
              value: fechaHasta ? fechaHasta.toISOString() : '',
              onChange: v => setFechaHasta(v ? new Date(v) : null)
            },
            { tipo: 'input', label: 'Marca:', value: marca, onChange: setMarca, placeholder: 'Ej: Toyota' },
            { tipo: 'input', label: 'Modelo:', value: modelo, onChange: setModelo, placeholder: 'Ej: Corolla' },
            { tipo: 'input', label: 'Dueño:', value: dueno, onChange: setDueno, placeholder: 'Ej: Maria Suarez' }
          ]}
          onFiltrar={filtrarVehiculos}
          onExportar={exportarVehiculos}
          onLimpiar={limpiarFiltros}
        />
      </div>

      {/* Modales */}
      <Modal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSubmit={registrarNuevoVehiculo}
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
        onConfirm={eliminarVehiculo}
        entidad="el vehículo"
      />

      <ModalEditarClienteVehiculo
        // Control de visibilidad del modal
        isOpen={modalEditarAbierto}
        onClose={() => setModalEditarAbierto(false)}

        // Título del modal
        titulo="Editar Vehículo"

        // Campos que se mostrarán en el formulario del modal
        campos={[
          {
            name: 'placa',
            label: 'Placa',
            type: 'text',
            value: vehiculoEditando.placa, // Valor actual de la placa
          },
          {
            name: 'marca',
            label: 'Marca',
            type: 'text',
            value: vehiculoEditando.marca, // Valor actual de la marca
          },
          {
            name: 'modelo',
            label: 'Modelo',
            type: 'text',
            value: vehiculoEditando.modelo, // Valor actual del modelo
          },
          {
            name: 'anio',
            label: 'Año',
            type: 'number',
            value: vehiculoEditando.anio?.toString() || '', // Convertimos a string, con fallback vacío
          },
          {
            name: 'color',
            label: 'Color',
            type: 'text',
            value: vehiculoEditando.color, // Valor actual del color
          },
        ]}

        // Función que maneja cambios en los inputs
        onChange={handleInputChange}

        // Función que guarda los cambios realizados
        onSubmit={guardarCambiosVehiculo}
      />

    </div>
  );
};

export default Vehiculos;
