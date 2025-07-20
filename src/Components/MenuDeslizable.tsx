// src/components/MenuDeslizable.tsx
import '../Styles/Componentes/MenuDesplegable.css';

const MenuDeslizable = () => {
  return (
    <div className="menu-deslizable">
      <ul>
        <li><a href="/vehiculos">Vehículos</a></li>
        <li><a href="/fichatecnica">Ficha Técnica</a></li>
        <li><a href="/clientes">Clientes</a></li>
        <li><a href="/Empleados">Trabajadores</a></li>
        <li><a href="/Asistencias">Asistencias</a></li>
      </ul>
    </div>
  );
};

export default MenuDeslizable;
