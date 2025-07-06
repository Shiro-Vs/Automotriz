// src/pages/Dashboard.tsx

import '../Styles/Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1 className="titulo-principal">Bienvenido Robert</h1>
      <div className="contenido-dashboard">
        {/* Panel izquierdo */}
        <div className="panel-izquierdo">
          <div className='contenedor'>
            <h2 className="titulo-seccion">Pendientes</h2>
            <section className="seccion">
              <div className="contenedor-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Auto</th>
                      <th>Tiempo de reparación</th>
                      <th>Encargado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Toyota Corolla</td>
                      <td>2h</td>
                      <td>Juan</td>
                    </tr>
                    <tr>
                      <td>Toyota Corolla</td>
                      <td>2h</td>
                      <td>Juan</td>
                    </tr>
                    <tr>
                      <td>Toyota Corolla</td>
                      <td>2h</td>
                      <td>Juan</td>
                    </tr>
                    <tr>
                      <td>Toyota Corolla</td>
                      <td>2h</td>
                      <td>Juan</td>
                    </tr>
                    <tr>
                      <td>Toyota Corolla</td>
                      <td>2h</td>
                      <td>Juan</td>
                    </tr>
                    <tr>
                      <td>Toyota Corolla</td>
                      <td>2h</td>
                      <td>Juan</td>
                    </tr>
                    <tr>
                      <td>Toyota Corolla</td>
                      <td>2h</td>
                      <td>Juan</td>
                    </tr>
                    <tr>
                      <td>Toyota Corolla</td>
                      <td>2h</td>
                      <td>Juan</td>
                    </tr>
                    <tr>
                      <td>Toyota Corolla</td>
                      <td>2h</td>
                      <td>Juan</td>
                    </tr>
                    <tr>
                      <td>Toyota Corolla</td>
                      <td>2h</td>
                      <td>Juan</td>
                    </tr>
                    <tr>
                      <td>Toyota Corolla</td>
                      <td>2h</td>
                      <td>Juan</td>
                    </tr>
                    <tr>
                      <td>Toyota Corolla</td>
                      <td>2h</td>
                      <td>Juan</td>
                    </tr>

                    {/* Agrega más filas si deseas */}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="contenedor">
              <h2 className="titulo-seccion">Servicios en curso</h2>
              <section className="seccion">
                <div className="contenedor-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Auto</th>
                        <th>Hora de inicio</th>
                        <th>Técnico</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Honda Civic</td>
                        <td>08:30</td>
                        <td>Ana</td>
                        <td>En progreso</td>
                      </tr>
                      <tr>
                        <td>Honda Civic</td>
                        <td>08:30</td>
                        <td>Ana</td>
                        <td>En progreso</td>
                      </tr>
                      <tr>
                        <td>Honda Civic</td>
                        <td>08:30</td>
                        <td>Ana</td>
                        <td>En progreso</td>
                      </tr>
                      <tr>
                        <td>Honda Civic</td>
                        <td>08:30</td>
                        <td>Ana</td>
                        <td>En progreso</td>
                      </tr>
                      <tr>
                        <td>Honda Civic</td>
                        <td>08:30</td>
                        <td>Ana</td>
                        <td>En progreso</td>
                      </tr>
                      <tr>
                        <td>Honda Civic</td>
                        <td>08:30</td>
                        <td>Ana</td>
                        <td>En progreso</td>
                      </tr>
                      <tr>
                        <td>Honda Civic</td>
                        <td>08:30</td>
                        <td>Ana</td>
                        <td>En progreso</td>
                      </tr>
                      <tr>
                        <td>Honda Civic</td>
                        <td>08:30</td>
                        <td>Ana</td>
                        <td>En progreso</td>
                      </tr>
                      <tr>
                        <td>Honda Civic</td>
                        <td>08:30</td>
                        <td>Ana</td>
                        <td>En progreso</td>
                      </tr>
                      <tr>
                        <td>Honda Civic</td>
                        <td>08:30</td>
                        <td>Ana</td>
                        <td>En progreso</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

          </div>
        </div>

        {/* Panel derecho */}
        <div className="panel-derecho">
          <div className='contenedor contenedor-grande'>
            <h2 className="titulo-seccion">Notificaciones</h2>
            <section className="seccion">
              <div className="contenedor-scroll">
                <ul className="notificaciones">
                  <li>Revisión de motor completada</li>
                  <li>Nuevo cliente registrado</li>
                  <li>Falta aceite en taller</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
