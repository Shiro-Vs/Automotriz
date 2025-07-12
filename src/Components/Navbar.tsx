import '../Styles/Navbar.css';

import logo from '../assets/Logos/logo.png';
import { Link } from "react-router-dom";

import MenuDeslizable from './MenuDeslizable';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const mostrarMenu = location.pathname !== '/'; // No mostrar en login

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/dashboard">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
      </div>
      {mostrarMenu && <MenuDeslizable />}
    </nav>
  );
};

export default Navbar;
