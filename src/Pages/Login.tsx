// 📦 Importaciones
import '../Styles/Login.css';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import axios from 'axios';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ModalErrorInicioSesion from '../Components/Modales/ModalErrorInicioSesion';
import ModalRegistrarAsistencia from '../Components/Modales/ModalRegistrarAsistencia';
import ModalError from '../Components/Modales/ModalError';

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [contrasenia, setContrasena] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [mostrarAsistenciaModal, setMostrarAsistenciaModal] = useState(false);
  const [trabajadorId, setTrabajadorId] = useState<number | null>(null);
  const [trabajadorRol, setTrabajadorRol] = useState<string | null>(null);
  const [mostrarError, setMostrarError] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [mostrarErrorCredenciales, setMostrarErrorCredenciales] = useState(false);

  const navigate = useNavigate();

  // 🔐 Manejador del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("${import.meta.env.VITE_API_URL}/trabajadores/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni: usuario, contrasenia }),
      });

      if (!response.ok) {
        setMostrarErrorCredenciales(true);
        setUsuario("");
        setContrasena("");
        return;
      }

      const data = await response.json();
      console.log("✅ Login exitoso:", data);

      localStorage.setItem("usuarioActual", data.nombre);
      localStorage.setItem("rolUsuario", data.rol);
      localStorage.setItem("idUsuario", data.id);

      const rol = data.rol.toLowerCase();
      const fechaActual = new Date();
      const fecha = fechaActual.toISOString().split("T")[0];
      const horaEntrada = fechaActual.toTimeString().split(" ")[0];

      if (rol === "administrador") {
        const asistenciaResponse = await fetch("${import.meta.env.VITE_API_URL}/asistencias", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idTrabajador: data.id,
            fecha,
            horaEntrada,
            llegoTarde: false,
            falto: false,
          }),
        });

        const resultado = await asistenciaResponse.text(); // <- ⚠️ Es un texto plano

        if (resultado === "El usuario está inactivo.") {
          setMensajeError("Usuario inactivo");
          setMostrarError(true);
          return;
        }

        navigate("/dashboard");
      }
      else if (rol === "mecanico" || rol === "mecánico") {
        setTrabajadorId(data.id);
        setTrabajadorRol(rol);
        setMostrarAsistenciaModal(true);
      }

    } catch (error) {
      console.error("❌ Error de red:", error);
      setMensajeError("Error de red o servidor");
      setMostrarError(true);
    }
  };

  // ✅ Registrar asistencia desde el modal
  const handleRegistrarAsistencia = async (idTrabajador: number, rol: string) => {
    try {
      const fechaActual = new Date();
      const fecha = fechaActual.toISOString().split("T")[0];
      const horaEntrada = fechaActual.toTimeString().split(" ")[0];

      const asistencia = {
        idTrabajador: idTrabajador,
        fecha,
        horaEntrada,
        llegoTarde: false,
        falto: false,
      };

      const response = await axios.post(
        "${import.meta.env.VITE_API_URL}/asistencias",
        asistencia
      );

      if (response.status === 200 || response.status === 201) {
        console.log("✅ Asistencia registrada correctamente");

        if (rol !== "mecanico" && rol !== "mecánico") {
          navigate("/dashboard");
        } else {
          alert("✅ Asistencia registrada. Contacta al administrador para más funciones.");
        }
      }
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        setMensajeError("Usuario inactivo"); // Tu mensaje personalizado
        setMostrarError(true); // Abrir el modal
      } else {
        setMensajeError("Ocurrió un error al registrar asistencia");
        setMostrarError(true);
      }
    }
  };



  return (
    <div className="fondo-login">
      <div className="login-container">
        <h2>SAF SERVICE</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="usuario">Usuario</label>
          <input
            id="usuario"
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="43841945"
            required
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) => (e.target.placeholder = "43841945")}
          />

          <label htmlFor="contrasena">Contraseña</label>
          <div className="input-con-icono">
            <input
              id="contrasena"
              type={verPassword ? "text" : "password"}
              value={contrasenia}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="*************"
              required
              onFocus={(e) => (e.target.placeholder = "")}
              onBlur={(e) => (e.target.placeholder = "*************")}
            />
            <span
              className="icono-ojo"
              onClick={() => setVerPassword((prev) => !prev)}
            >
              {verPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="olvido-contrasena">
            <a href="#">¿Se te olvidó la contraseña?</a>
          </div>

          <button type="submit">Ingresar</button>

          <p className="copyright">
            @SafService todos los derechos reservados 2025
          </p>
        </form>
      </div>

      {/* ❌ Modal de error */}
      {mostrarErrorCredenciales && (
        <ModalErrorInicioSesion onClose={() => setMostrarErrorCredenciales(false)} />
      )}


      {/* ✅ Modal para mecánicos */}
      {mostrarAsistenciaModal && trabajadorId !== null && trabajadorRol && (
        <ModalRegistrarAsistencia
          idTrabajador={trabajadorId}
          onClose={() => setMostrarAsistenciaModal(false)}
          registrar={async (confirmado: boolean) => {
            if (confirmado) {
              await handleRegistrarAsistencia(trabajadorId, trabajadorRol);
            }
            setMostrarAsistenciaModal(false);
          }}
        />
      )}

      <ModalError
        isOpen={mostrarError}
        mensaje={mensajeError}
        onClose={() => setMostrarError(false)}
      />

    </div>
  );
};

export default Login;
