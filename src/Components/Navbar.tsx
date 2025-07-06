import '../Styles/Navbar.css';

import logo from '../assets/Logos/logo.png';

import MenuDeslizable from './MenuDeslizable';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const mostrarMenu = location.pathname !== '/'; // No mostrar en login

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      {mostrarMenu && <MenuDeslizable />}
    </nav>
  );
};

export default Navbar;
