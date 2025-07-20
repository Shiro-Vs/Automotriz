// 📦 Importaciones
import '../Styles/Login.css';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ModalErrorInicioSesion from '../Components/Modales/ModalErrorInicioSesion';
import ModalRegistrarAsistencia from '../Components/Modales/ModalRegistrarAsistencia';

const Login = () => {
  // 🎯 Estados locales
  const [usuario, setUsuario] = useState("");               // DNI ingresado
  const [contrasenia, setContrasena] = useState("");        // Contraseña ingresada
  const [verPassword, setVerPassword] = useState(false);    // Mostrar u ocultar contraseña
  const [mostrarError, setMostrarError] = useState(false);  // Mostrar modal de error
  const [mostrarAsistenciaModal, setMostrarAsistenciaModal] = useState(false);

  const navigate = useNavigate(); // Redirección

  // 🔐 Manejador del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/trabajadores/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni: usuario, contrasenia }),
      });

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        // Si es texto plano (como "Acceso restringido..."), lo tratamos como tal
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          console.warn("❌ Error JSON:", errorData);
        } else {
          const errorText = await response.text();
          console.warn("❌ Error texto:", errorText);
        }

        setMostrarError(true);
        setUsuario("");
        setContrasena("");
        return;
      }

      // ✅ Si todo salió bien
      const data = await response.json();
      console.log("✅ Respuesta del backend:", data);

      localStorage.setItem("usuarioActual", data.nombre);
      localStorage.setItem("rolUsuario", data.rol);

      if (data.rol.toLowerCase() === 'mecánico' || data.rol.toLowerCase() === 'mecanico') {
        setMostrarAsistenciaModal(true);
      } else {
        navigate('/dashboard');
      }

      setUsuario("");
      setContrasena("");

    } catch (error) {
      console.error("❌ Error de red o servidor:", error);
      setMostrarError(true);
    }
  };

  return (
    <div className="fondo-login">
      <div className="login-container">
        <h2>SAF SERVICE</h2>

        {/* 📋 Formulario de inicio de sesión */}
        <form className="login-form" onSubmit={handleSubmit}>

          {/* 🧍‍♂️ Usuario (DNI) */}
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

          {/* 🔑 Contraseña + botón de mostrar/ocultar */}
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

          {/* ❓ Enlace para recuperación */}
          <div className="olvido-contrasena">
            <a href="#">¿Se te olvidó la contraseña?</a>
          </div>

          {/* ✅ Botón ingresar */}
          <button type="submit">Ingresar</button>

          {/* 📄 Pie de página */}
          <p className="copyright">
            @SafService todos los derechos reservados 2025
          </p>
        </form>
      </div>

      {/* ❌ Modal en caso de error */}
      {mostrarError && (
        <ModalErrorInicioSesion onClose={() => setMostrarError(false)} />
      )}

      {mostrarAsistenciaModal && (
        <ModalRegistrarAsistencia onClose={() => setMostrarAsistenciaModal(false)} />
      )}

    </div>


  );
};

export default Login;
