// 📦 Importaciones
import styles from '../Styles/Login.module.css';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ModalErrorInicioSesion from '../Components/Modales/ModalErrorInicioSesion';
import ModalRegistrarAsistencia from '../Components/Modales/ModalRegistrarAsistencia';
import ModalError from '../Components/Modales/ModalError';
import { useAuth } from '../context/AuthContext';
import { login as loginService, registrarAsistencia } from '../services/authService';

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
  const { login } = useAuth();

  // 🔐 Manejador del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const data = await loginService(usuario, contrasenia);
      console.log("✅ Login exitoso:", data);

      // Usar el contexto para guardar la sesión
      login(data);

      const rol = data.rol.toLowerCase();
      const fechaActual = new Date();
      const fecha = fechaActual.toISOString().split("T")[0];
      const horaEntrada = fechaActual.toTimeString().split(" ")[0];

      if (rol === "administrador") {
        try {
          await registrarAsistencia({
            idTrabajador: data.id,
            fecha,
            horaEntrada,
            llegoTarde: false,
            falto: false,
          });
          navigate("/dashboard");
        } catch (error: any) {
          // Manejo específico si el usuario está inactivo (según lógica original)
           if (error.response && error.response.data === "El usuario está inactivo.") {
            setMensajeError("Usuario inactivo");
            setMostrarError(true);
            return;
          }
          // Si falla la asistencia pero es admin, quizás debería entrar igual?
          // Mantengo lógica original de navegar
          navigate("/dashboard");
        }
      }
      else if (rol === "mecanico" || rol === "mecánico") {
        setTrabajadorId(data.id);
        setTrabajadorRol(rol);
        setMostrarAsistenciaModal(true);
      }

    } catch (error: any) {
      console.error("❌ Error:", error);
      if (error.response && error.response.status === 401) {
         setMostrarErrorCredenciales(true);
         setUsuario("");
         setContrasena("");
      } else {
        setMensajeError("Error de red o servidor");
        setMostrarError(true);
      }
    }
  };

  // ✅ Registrar asistencia desde el modal
  const handleRegistrarAsistencia = async (idTrabajador: number, rol: string) => {
    try {
      const fechaActual = new Date();
      const fecha = fechaActual.toISOString().split("T")[0];
      const horaEntrada = fechaActual.toTimeString().split(" ")[0];

      await registrarAsistencia({
        idTrabajador,
        fecha,
        horaEntrada,
        llegoTarde: false,
        falto: false,
      });

      console.log("✅ Asistencia registrada correctamente");

      if (rol !== "mecanico" && rol !== "mecánico") {
        navigate("/dashboard");
      } else {
        alert("✅ Asistencia registrada. Contacta al administrador para más funciones.");
      }
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        setMensajeError("Usuario inactivo");
        setMostrarError(true);
      } else {
        setMensajeError("Ocurrió un error al registrar asistencia");
        setMostrarError(true);
      }
    }
  };

  return (
    <div className={styles.fondoLogin}>
      <div className={styles.loginContainer}>
        <h2>SAF SERVICE</h2>

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <label htmlFor="usuario">Usuario</label>
          <input
            id="usuario"
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="43841945"
            required
            // Se recomienda usar CSS para el placeholder en focus, pero mantengo comportamiento original por ahora
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) => (e.target.placeholder = "43841945")}
          />

          <label htmlFor="contrasena">Contraseña</label>
          <div className={styles.inputConIcono}>
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
              className={styles.iconoOjo}
              onClick={() => setVerPassword((prev) => !prev)}
            >
              {verPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className={styles.olvidoContrasena}>
            <a href="#">¿Se te olvidó la contraseña?</a>
          </div>

          <button type="submit">Ingresar</button>

          <p className={styles.copyright}>
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
