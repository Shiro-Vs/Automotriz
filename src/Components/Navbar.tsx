// src/components/Navbar.tsx
import '../Styles/Navbar.css';
import logo from '../assets/Logos/logo.png'; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <img src={logo} alt="Logo" className="logo" />
      </div>
    </nav>
  );
};

export default Navbar;
