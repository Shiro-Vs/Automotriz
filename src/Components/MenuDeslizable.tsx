// src/components/MenuDeslizable.tsx
import '../Styles/MenuDesplegable.css';

const MenuDeslizable = () => {
  return (
    <div className="menu-deslizable">
      <ul>
        <li><a href="/vehiculos">Vehículos</a></li>
        <li><a href="/fichatecnica">Ficha Técnica</a></li>
        <li><a href="/clientes">Clientes</a></li>
        <li><a href="/Empleados">Trabajadores</a></li>
        <li><a href="/Reportes">Reportes</a></li>
        {/* Agrega más opciones aquí */}
      </ul>
    </div>
  );
};

export default MenuDeslizable;
