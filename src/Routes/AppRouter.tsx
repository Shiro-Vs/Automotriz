// src/routes/AppRouter.tsx
import { Routes, Route } from 'react-router-dom';
import Login from '../Pages/Login';
import Dashboard from '../Pages/Dashboard';
import Citas from '../Pages/Citas';
import FichaTecnica from '../Pages/FichaTecnica';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/citas" element={<Citas />} />
      <Route path="/fichatecnica" element={<FichaTecnica />} />
      {/* Agrega más rutas aquí */}
    </Routes>
  );
};

export default AppRouter;
