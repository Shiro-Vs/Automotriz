// 🔹 Importaciones necesarias
import { useEffect, useState } from 'react';
import logo from '../../assets/Logos/logo.png';
import '../../Styles/Modales/ModalNuevoVehiculo.css';
import FormatoInputs from '../FormatoInputs';
import ModalError from './ModalError';

// 🔹 Interfaz de propiedades del componente
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (nuevoVehiculo: any) => void;
  onExito: (mensaje: string) => void;
}

// 🔹 Componente principal Modal
const Modal = ({ isOpen, onClose, onSubmit,onExito}: ModalProps) => {
  // 🧾 Estado del cliente
  const [cliente, setCliente] = useState({
    nombre: '',
    dni: '',
    celular: '',
    email: '',
    direccion: '',
  });

  // 🚗 Estado del vehículo
  const [vehiculo, setVehiculo] = useState({
    placa: '',
    marca: '',
    modelo: '',
    anio: '',
    color: '',
  });

  // ❌ Estado de errores de validación
  const [errores, setErrores] = useState<{ [campo: string]: string }>({});
  const [validos, setValidos] = useState<{ [campo: string]: boolean }>({});
  const [errorModalAbierto, setErrorModalAbierto] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

    // 🔍 Buscar cliente por DNI y autocompletar si ya existe
    const [clienteEncontrado, setClienteEncontrado] = useState(false);

    // ⌨️ Efecto para cerrar modal con tecla Escape
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // 🧼 Efecto para limpiar campos al abrir el modal
    useEffect(() => {
      if (isOpen) {
        setCliente({ nombre: '', dni: '', celular: '', email: '', direccion: '' });
        setVehiculo({ placa: '', marca: '', modelo: '', anio: '', color: '' });
        setErrores({});
        setClienteEncontrado(false);
      }
    }, [isOpen]);

    const actualizarValidez = (campo: string, esValido: boolean) => {
      setValidos(prev => {
        if (prev[campo] === esValido) return prev; // ✅ No actualizar si no cambia
        return { ...prev, [campo]: esValido };
      });
    };

    const handleClienteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setCliente((prev) => ({ ...prev, [name]: value }));
    };

    const handleVehiculoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setVehiculo((prev) => ({ ...prev, [name]: value }));
    };

    const validarFormulario = () => {
      const nuevosErrores: { [campo: string]: string } = {};

      // Validaciones por formato
      if (validos.dni === false) nuevosErrores.dni = "DNI/RUC inválido";
      if (validos.celular === false) nuevosErrores.celular = "Teléfono inválido";
      if (validos.email === false) nuevosErrores.email = "Email inválido";
      if (validos.placa === false) nuevosErrores.placa = "Placa inválida";
      if (validos.anio === false) nuevosErrores.anio = "Año inválido";
      if (!vehiculo.color.trim()) nuevosErrores.color = "Color requerido";

      // Validar campos obligatorios (excepto email y direccion)
      if (!cliente.nombre.trim()) nuevosErrores.nombre = "Nombre requerido";
      if (!cliente.dni.trim()) nuevosErrores.dni ||= "DNI/RUC requerido";
      if (!cliente.celular.trim()) nuevosErrores.celular ||= "Teléfono requerido";
      if (!vehiculo.marca.trim()) nuevosErrores.marca = "Marca requerida";
      if (!vehiculo.placa.trim()) nuevosErrores.placa ||= "Placa requerida";
      if (!vehiculo.modelo.trim()) nuevosErrores.modelo = "Modelo requerido";
      if (!vehiculo.anio.trim()) nuevosErrores.anio ||= "Año requerido";

      const anio = Number(vehiculo.anio);
      const anioActual = new Date().getFullYear();
      if (anio && (anio < 1950 || anio > anioActual)) {
        nuevosErrores.anio = `Año debe estar entre 1950 y ${anioActual}`;
      }

      setErrores(nuevosErrores);
      return Object.keys(nuevosErrores).length === 0;
    };

    const formatearCelular = (numero: string) => {
      const limpio = numero.replace(/\D/g, '').slice(0, 9);
      return limpio.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    };

    const buscarClientePorDNIoRUC = async (documento: string) => {
      try {
        const res = await fetch('http://localhost:8080/api/clientes');
        const data = await res.json();

        const clienteExistente = data.find((c: any) => c.dni === documento);

        if (clienteExistente) {
          setCliente({
            dni: clienteExistente.dni,
            nombre: clienteExistente.nombre,
            celular: formatearCelular(clienteExistente.celular),
            email: clienteExistente.email,
            direccion: clienteExistente.direccion,
          });
          setClienteEncontrado(true);
        } else {
          setCliente(prev => ({ ...prev, nombre: '', celular: '', email: '', direccion: '' }));
          setClienteEncontrado(false);
        }
      } catch (error) {
        console.error('Error al buscar cliente por documento:', error);
      }
    };

    const handleSubmit = async () => {

      if (!validarFormulario()) {
        setMensajeError("Por favor completa correctamente todos los campos requeridos.");
        setErrorModalAbierto(true);
        return;
      }

      try {
        const clientesRes = await fetch('http://localhost:8080/api/clientes');
        const clientes = await clientesRes.json();
        let clienteCreado = clientes.find((c: any) => c.dni === cliente.dni);

        if (!clienteCreado) {
          const clienteRes = await fetch('http://localhost:8080/api/clientes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cliente),
          });

          if (!clienteRes.ok) {
            const msg = await clienteRes.text();
            return alert("Error al registrar cliente: " + msg);
          }

          clienteCreado = await clienteRes.json();
        }

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
        onSubmit({ ...vehiculoRegistrado, nombreCliente: cliente.nombre });

        onExito("Vehículo registrado correctamente.");

        setCliente({ nombre: '', dni: '', celular: '', email: '', direccion: '' });
        setVehiculo({ placa: '', marca: '', modelo: '', anio: '', color: '' });

      } catch (err) {
        console.error(err);
        alert("Error inesperado al registrar.");
      }
    };

    if (!isOpen) return null;



    return (
      <div className="modal-overlay" onClick={() => {
        if (!errorModalAbierto) {
          onClose();
        }
      }}>

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
                <FormatoInputs tipo="rucdni" valor={cliente.dni} onChange={(valor) => {
                  setCliente(prev => ({ ...prev, dni: valor }));
                  const esDNI = /^\d{8}$/.test(valor);
                  const esRUC = /^(10|15|16|17|20)\d{9}$/.test(valor);
                  if (esDNI || esRUC) buscarClientePorDNIoRUC(valor);
                }} onValidoChange={(valido) => actualizarValidez("dni", valido)} placeholder="DNI (8 dígitos) o RUC (11 dígitos)" className="input-formateado" />

                <label>Nombre / Razón Social</label>
                <input name="nombre" value={cliente.nombre} onChange={handleClienteChange} placeholder="Juan Pérez o Empresa SAC" disabled={clienteEncontrado} />

                <label>Teléfono</label>
                <FormatoInputs tipo="telefono" valor={cliente.celular} onChange={(valor) => setCliente(prev => ({ ...prev, celular: valor }))} onValidoChange={(valido) => actualizarValidez("celular", valido)} placeholder="999 888 777" className="input-formateado" disabled={clienteEncontrado} />

                <label>Email</label>
                <FormatoInputs tipo="email" valor={cliente.email} onChange={(valor) => setCliente(prev => ({ ...prev, email: valor }))} onValidoChange={(valido) => actualizarValidez("email", valido)} placeholder="contacto@xyz.com" className="input-formateado" disabled={clienteEncontrado} />

                <label>Dirección</label>
                <input name="direccion" value={cliente.direccion} onChange={handleClienteChange} placeholder="Av. Siempre Viva 123" disabled={clienteEncontrado} />
              </div>

              <div className="form-section">
                <h3>Vehículo</h3>
                <label>Marca</label>
                <input name="marca" value={vehiculo.marca} onChange={handleVehiculoChange} placeholder="Toyota, Hyundai..." />

                <label>Placa</label>
                <FormatoInputs tipo="placa" valor={vehiculo.placa} onChange={(valor) => setVehiculo(prev => ({ ...prev, placa: valor }))} onValidoChange={(valido) => actualizarValidez("placa", valido)} placeholder="ABC-123" className="input-formateado" />

                <label>Modelo</label>
                <input name="modelo" value={vehiculo.modelo} onChange={handleVehiculoChange} placeholder="Elantra, Corolla..." />

                <label>Año</label>
                <FormatoInputs tipo="anio" valor={vehiculo.anio} onChange={(valor) => setVehiculo(prev => ({ ...prev, anio: valor }))} onValidoChange={(valido) => actualizarValidez("anio", valido)} placeholder="2020" className="input-formateado" />

                <label>Color</label>
                <FormatoInputs tipo="color" valor={vehiculo.color} onChange={(valor) => setVehiculo(prev => ({ ...prev, color: valor }))} onValidoChange={(valido) => actualizarValidez("color", valido)} placeholder="Rojo, Azul..." className="input-formateado" />
              </div>
            </div>

            <button className="boton-enviar" onClick={handleSubmit}>Enviar</button>
          </div>
        </div>

        <ModalError
          isOpen={errorModalAbierto}
          mensaje={mensajeError}
          onClose={() => setErrorModalAbierto(false)}
        />

      </div>
    );
  };

  export default Modal;
