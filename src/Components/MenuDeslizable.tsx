// src/components/MenuDeslizable.tsx
import '../Styles/MenuDesplegable.css';

const MenuDeslizable = () => {
  return (
    <div className="menu-deslizable">
      <ul>
        <li><a href="/citas">Citas</a></li>
        <li><a href="/ficha-tecnica">Ficha Técnica</a></li>
        <li><a href="/clientes">Clientes</a></li>
        {/* Agrega más opciones aquí */}
      </ul>
    </div>
  );
};

export default MenuDeslizable;
