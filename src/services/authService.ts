import api from '../api/axios';
import type { Usuario, Asistencia } from '../types';

export const login = async (dni: string, contrasenia: string): Promise<Usuario> => {
  const response = await api.post<Usuario>('/trabajadores/login', { dni, contrasenia });
  return response.data;
};

export const registrarAsistencia = async (asistencia: Asistencia): Promise<void> => {
  await api.post('/asistencias', asistencia);
};
