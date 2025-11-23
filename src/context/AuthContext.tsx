import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Usuario } from '../types';

interface AuthContextType {
  user: Usuario | null;
  isAuthenticated: boolean;
  login: (userData: Usuario) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);

  useEffect(() => {
    // Recuperar sesión al cargar
    const storedUser = localStorage.getItem('usuarioActual');
    const storedRole = localStorage.getItem('rolUsuario');
    const storedId = localStorage.getItem('idUsuario');

    if (storedUser && storedRole && storedId) {
      setUser({
        id: Number(storedId),
        nombre: storedUser,
        rol: storedRole,
      });
    }
  }, []);

  const login = (userData: Usuario) => {
    setUser(userData);
    localStorage.setItem('usuarioActual', userData.nombre);
    localStorage.setItem('rolUsuario', userData.rol);
    localStorage.setItem('idUsuario', userData.id.toString());
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('usuarioActual');
    localStorage.removeItem('rolUsuario');
    localStorage.removeItem('idUsuario');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
