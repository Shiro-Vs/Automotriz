import { useState, useEffect, useMemo } from 'react';
import type { Vehiculo } from '../types';
import * as vehiculoService from '../services/vehiculoService';

export const useVehiculos = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [filtros, setFiltros] = useState({
    marca: '',
    modelo: '',
    dueno: '',
    anio: '',
    fechaDesde: null as Date | null,
    fechaHasta: null as Date | null,
  });

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const cargarVehiculos = async () => {
    setLoading(true);
    try {
      const data = await vehiculoService.getVehiculos();
      setVehiculos(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error al cargar vehículos');
    } finally {
      setLoading(false);
    }
  };

  const agregarVehiculo = async (vehiculo: Omit<Vehiculo, 'id'>) => {
    try {
      const nuevo = await vehiculoService.createVehiculo(vehiculo);
      setVehiculos(prev => [...prev, nuevo]);
      return nuevo;
    } catch (err) {
      throw err;
    }
  };

  const editarVehiculo = async (id: number, datos: Partial<Vehiculo>) => {
    try {
      const actualizado = await vehiculoService.updateVehiculo(id, datos);
      setVehiculos(prev => prev.map(v => (v.id === id ? actualizado : v)));
      return actualizado;
    } catch (err) {
      throw err;
    }
  };

  const eliminarVehiculo = async (id: number) => {
    try {
      await vehiculoService.deleteVehiculo(id);
      setVehiculos(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      throw err;
    }
  };

  // Lógica de filtrado memorizada
  const vehiculosFiltrados = useMemo(() => {
    return vehiculos.filter(v => {
      const fecha = new Date(v.fechaRegistro);
      const { marca, modelo, dueno, anio, fechaDesde, fechaHasta } = filtros;

      return (
        (!fechaDesde || fecha >= fechaDesde) &&
        (!fechaHasta || fecha <= fechaHasta) &&
        (!marca || v.marca.toLowerCase().includes(marca.toLowerCase())) &&
        (!modelo || v.modelo.toLowerCase().includes(modelo.toLowerCase())) &&
        (!anio || v.anio.toString().includes(anio)) &&
        (!dueno || v.nombreCliente.toLowerCase().includes(dueno.toLowerCase()))
      );
    });
  }, [vehiculos, filtros]);

  const actualizarFiltro = (campo: keyof typeof filtros, valor: any) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      marca: '',
      modelo: '',
      dueno: '',
      anio: '',
      fechaDesde: null,
      fechaHasta: null,
    });
  };

  return {
    vehiculos: vehiculosFiltrados,
    loading,
    error,
    filtros,
    actualizarFiltro,
    limpiarFiltros,
    agregarVehiculo,
    editarVehiculo,
    eliminarVehiculo,
    recargar: cargarVehiculos,
  };
};
