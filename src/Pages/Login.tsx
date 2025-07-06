import '../Styles/Login.css';

import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [verPassword, setVerPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // evita que se recargue la página
    // Aquí podrías validar usuario y contraseña si deseas
    navigate('/dashboard'); // redirige al dashboard
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
    </div>
  );
};

export default Login;