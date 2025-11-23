import api from '../api/axios';
import type { Vehiculo } from '../types';

export const getVehiculos = async (): Promise<Vehiculo[]> => {
  const response = await api.get<Vehiculo[]>('/vehiculos');
  // Transformar datos si es necesario (ej. convertir anio a number si viene como string)
  return response.data.map((v: any) => ({
    ...v,
    anio: Number(v.anio),
  }));
};

export const createVehiculo = async (vehiculo: Omit<Vehiculo, 'id'>): Promise<Vehiculo> => {
  const response = await api.post<Vehiculo>('/vehiculos', vehiculo);
  return response.data;
};

export const updateVehiculo = async (id: number, vehiculo: Partial<Vehiculo>): Promise<Vehiculo> => {
  const response = await api.put<Vehiculo>(`/vehiculos/${id}`, vehiculo);
  return response.data;
};

export const deleteVehiculo = async (id: number): Promise<void> => {
  await api.delete(`/vehiculos/${id}`);
};
