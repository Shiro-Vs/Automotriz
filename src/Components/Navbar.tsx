// src/components/Navbar.tsx
import '../Styles/Navbar.css';
import logo from '../assets/react.svg';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="menu-desplegable">
          <button className="menu-button">Menú</button>
          <ul className="menu-items">
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/otra">Otra página</a></li>
          </ul>
        </div>
        <img src={logo} alt="Logo" className="logo" />
      </div>
    </nav>
  );
};

export default Navbar;
