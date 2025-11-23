export interface Usuario {
  id: number;
  nombre: string;
  rol: string;
}

export interface AuthResponse extends Usuario {
  token?: string; // In case your API returns a token in the future
}

export interface Vehiculo {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  fechaRegistro: string;
  idCliente: number;
  nombreCliente: string;
}

export interface Asistencia {
  idTrabajador: number;
  fecha: string;
  horaEntrada: string;
  llegoTarde: boolean;
  falto: boolean;
}
