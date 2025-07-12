import "../Styles/Vehiculos.css";

const Clientes = () => {
  return (
    <div className="pagina-citas">
      <div className="encabezado-citas">
        <h1 className="titulo-citas">Clientes</h1>
      </div>

      <div className="tabla-contenedor">
        <table className="tabla-citas">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>DNI / RUC</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Dirección</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Juan Pérez</td>
              <td>12345678</td>
              <td>987654321</td>
              <td>juan@example.com</td>
              <td>Av. Siempre Viva 123</td>
            </tr>
            <tr>
              <td>Empresa XYZ SAC</td>
              <td>20123456789</td>
              <td>999888777</td>
              <td>contacto@xyzsac.com</td>
              <td>Jr. Los Robles 456</td>
            </tr>
            {/* Agrega más filas según necesites */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clientes;
