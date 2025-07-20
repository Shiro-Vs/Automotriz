// src/routes/AppRouter.tsx
import { Routes, Route } from 'react-router-dom';

import Login from '../Pages/Login';
import Dashboard from '../Pages/Dashboard';
import FichaTecnica from '../Pages/FichaTecnica';
import Vehiculos from '../Pages/Vehiculos';
import Clientes from '../Pages/Clientes';
import Empleados from '../Pages/Empleados';
import Asistencias from '../Pages/Asistencias';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/vehiculos" element={<Vehiculos />} />
      <Route path="/fichatecnica" element={<FichaTecnica />} />
      <Route path="/clientes" element={<Clientes />} />
      <Route path="/empleados" element={<Empleados />} />
      <Route path="/asistencias" element={<Asistencias />} />
      {/* Agrega más rutas aquí */}
    </Routes>
  );
};

export default AppRouter;
