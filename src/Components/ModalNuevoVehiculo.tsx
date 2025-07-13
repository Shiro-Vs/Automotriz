import { useEffect, useState } from 'react';
import logo from '../assets/Logos/logo.png';
import '../Styles/Modales/ModalNuevoVehiculo.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (nuevoVehiculo: any) => void;
}

const Modal = ({ isOpen, onClose, onSubmit }: ModalProps) => {
  const [cliente, setCliente] = useState({
    nombre: '',
    dni: '',
    celular: '',
    email: '',
    direccion: '',
  });

  const [vehiculo, setVehiculo] = useState({
    placa: '',
    marca: '',
    modelo: '',
    anio: '',
    color: '',
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const handleClienteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCliente((prev) => ({ ...prev, [name]: value }));
  };

  const handleVehiculoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVehiculo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      // 1. Buscar si el cliente ya existe
      const clientesRes = await fetch('http://localhost:8080/api/clientes');
      const clientes = await clientesRes.json();
      const existente = clientes.find((c: any) => c.dni === cliente.dni);

      let clienteCreado = existente;

      // 2. Si no existe, registrar nuevo cliente
      if (!existente) {
        const clienteRes = await fetch('http://localhost:8080/api/clientes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cliente),
        });

        if (!clienteRes.ok) {
          const msg = await clienteRes.text();
          return alert("Error al registrar cliente: " + msg);
        }

        clienteCreado = await clienteRes.json(); // debe devolver el cliente con ID
      }

      // 3. Registrar vehículo
      const vehiculoData = {
        ...vehiculo,
        anio: Number(vehiculo.anio),
        fechaRegistro: new Date().toISOString().split("T")[0],
        idCliente: clienteCreado.id,
      };

      const vehiculoRes = await fetch('http://localhost:8080/api/vehiculos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehiculoData),
      });

      if (!vehiculoRes.ok) {
        const msg = await vehiculoRes.text();
        return alert("Error al registrar vehículo: " + msg);
      }

      const vehiculoRegistrado = await vehiculoRes.json();

      onSubmit({
        ...vehiculoRegistrado,
        nombreCliente: cliente.nombre,
      });

      alert("Vehículo registrado correctamente.");

      setCliente({ nombre: '', dni: '', celular: '', email: '', direccion: '' });
      setVehiculo({ placa: '', marca: '', modelo: '', anio: '', color: '' });
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error inesperado al registrar.");
    }
  };

  const buscarClientePorDNI = async () => {
    const dni = cliente.dni.trim();

    if (dni.length === 8) {
      try {
        const res = await fetch('http://localhost:8080/api/clientes');
        const data = await res.json();

        const clienteExistente = data.find((c: any) => c.dni === dni);

        if (clienteExistente) {
          setCliente({
            dni: clienteExistente.dni,
            nombre: clienteExistente.nombre,
            celular: clienteExistente.celular,
            email: clienteExistente.email,
            direccion: clienteExistente.direccion,
          });
        } else {
          // Si no existe el cliente, limpiar los campos para llenarlos manualmente
          setCliente((prev) => ({
            ...prev,
            nombre: '',
            celular: '',
            email: '',
            direccion: '',
          }));

        }
      } catch (error) {
        console.error('Error al buscar cliente:', error);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-navbar">
          <img src={logo} alt="Logo" className="modal-logo" />
        </div>

        <div className="modal-body">
          <h2 className="modal-titulo">Registrar nuevo vehículo</h2>

          <div className="formulario-columns">
            <div className="form-section">
              <h3>Cliente</h3>
              <label>DNI / RUC</label>
              <input name="dni" type="text" value={cliente.dni} onChange={handleClienteChange} onBlur={buscarClientePorDNI} placeholder="12345678 / 20123456789" />

              <label>Nombre / Razón Social</label>
              <input name="nombre" type="text" value={cliente.nombre} onChange={handleClienteChange} placeholder="Juan Pérez o Empresa SAC" />

              <label>Teléfono</label>
              <input name="celular" type="text" value={cliente.celular} onChange={handleClienteChange} placeholder="000 000 000" />

              <label>Email</label>
              <input name="email" type="text" value={cliente.email} onChange={handleClienteChange} placeholder="contacto@xyzsac.com" />

              <label>Dirección</label>
              <input name="direccion" type="text" value={cliente.direccion} onChange={handleClienteChange} placeholder="Av. Siempre Viva 123" />
            </div>

            <div className="form-section">
              <h3>Vehículo</h3>
              <label>Marca</label>
              <input name="marca" type="text" value={vehiculo.marca} onChange={handleVehiculoChange} placeholder="Toyota, Hyundai..." />

              <label>Placa</label>
              <input name="placa" type="text" value={vehiculo.placa} onChange={handleVehiculoChange} placeholder="ABC-123" />

              <label>Modelo</label>
              <input name="modelo" type="text" value={vehiculo.modelo} onChange={handleVehiculoChange} placeholder="Elantra, Corolla..." />

              <label>Año</label>
              <input name="anio" type="number" value={vehiculo.anio} onChange={handleVehiculoChange} placeholder="2020" />

              <label>Color</label>
              <input name="color" type="text" value={vehiculo.color} onChange={handleVehiculoChange} placeholder="Rojo, Azul..." />
            </div>
          </div>

          <button className="boton-enviar" onClick={handleSubmit}>Enviar</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
