// src/pages/Dashboard.tsx
import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

import '../Styles/Dashboard.css';

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [kpi] = useState({
    vehiculosHoy: 12,
    serviciosFinalizados: 8,
    tecnicosActivos: 4,
  });

  const datosEstado = [
    { estado: 'Pendiente', cantidad: 5 },
    { estado: 'En curso', cantidad: 3 },
    { estado: 'Finalizado', cantidad: 8 },
  ];

  const datosServicios = [
    { tipo: 'Mecánica', valor: 10 },
    { tipo: 'Eléctrica', valor: 4 },
    { tipo: 'Revisión', valor: 6 },
  ];

  const colores = ['#3bcc75', '#ffc845', '#112344'];

  // Configuración del gráfico de barras
  const barData = {
    labels: datosEstado.map((item) => item.estado),
    datasets: [
      {
        label: 'Cantidad',
        data: datosEstado.map((item) => item.cantidad),
        backgroundColor: '#3bcc75',
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  // Configuración del gráfico de pastel
  const pieData = {
    labels: datosServicios.map((item) => item.tipo),
    datasets: [
      {
        label: 'Servicios',
        data: datosServicios.map((item) => item.valor),
        backgroundColor: colores,
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="dashboard-container">
      <h1 className="titulo-principal">Bienvenido Robert</h1>

      <div className="contenido-principal">
        <div className="columna-izquierda">
          <div className="tabla">
            <h3>Trabajos Pendientes</h3>
            <table>
              <thead>
                <tr><th>Auto</th><th>Técnico</th></tr>
              </thead>
              <tbody>
                <tr><td>Toyota Corolla</td><td>Juan</td></tr>
                <tr><td>Hyundai Elantra</td><td>Pedro</td></tr>
              </tbody>
            </table>
          </div>
          <div className="tabla">
            <h3>Trabajos en Curso</h3>
            <table>
              <thead>
                <tr><th>Auto</th><th>Hora de Inicio</th><th>Técnico</th></tr>
              </thead>
              <tbody>
                <tr><td>Honda Civic</td><td>08:30</td><td>Ana</td></tr>
                <tr><td>Chevrolet Aveo</td><td>09:00</td><td>Luis</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="columna-centro">
          <div className="grafico">
            <h3>Servicios por Estado</h3>
            <Bar data={barData} options={barOptions} />
          </div>
          <div className="grafico">
            <h3>Tipo de Servicios</h3>
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
        <div className="columna-derecha">
          <div className="kpi">
            <h3>Vehículos Hoy</h3>
            <p>{kpi.vehiculosHoy}</p>
          </div>
          <div className="kpi">
            <h3>Servicios Finalizados</h3>
            <p>{kpi.serviciosFinalizados}</p>
          </div>
          <div className="kpi">
            <h3>Técnicos Activos</h3>
            <p>{kpi.tecnicosActivos}</p>
          </div>
        </div>
      </div>


    </div>
  );

};

export default Dashboard;
