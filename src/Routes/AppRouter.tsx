// src/routes/AppRouter.tsx
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../Components/MainLayout';

import Login from '../Pages/Login';
import Dashboard from '../Pages/Dashboard';
import FichaTecnica from '../Pages/FichaTecnica';
import Vehiculos from '../Pages/Vehiculos';
import Clientes from '../Pages/Clientes';
import Empleados from '../Pages/Empleados';
import Asistencias from '../Pages/Asistencias';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "vehiculos",
        element: <Vehiculos />,
      },
      {
        path: "fichatecnica",
        element: <FichaTecnica />,
      },
      {
        path: "clientes",
        element: <Clientes />,
      },
      {
        path: "empleados",
        element: <Empleados />,
      },
      {
        path: "asistencias",
        element: <Asistencias />,
      },
    ],
  },
]);

export default router;
