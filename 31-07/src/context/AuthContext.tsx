import React, { createContext, useState, useEffect } from 'react';
import type{  ReactNode } from 'react';
import type{ LoginCredentials, RegistroOferenteData, RegistroSolicitanteData } from '../api/authApi';
import { authApi } from '../api/authApi';
import type{ User, AuthContextType } from '../types/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (correo: string, contrasena: string) => {
    try {
      const response = await authApi.login({ correo, contrasena });
      const { token, usuario } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(usuario));

      setToken(token);
      setUser(usuario);

      toast.success('¡Bienvenido!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al iniciar sesión';
      toast.error(message);
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.success('Sesión cerrada');
  };

  const registerOferente = async (data: RegistroOferenteData) => {
    try {
      const response = await authApi.registroOferente(data);
      const { token, usuario } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(usuario));

      setToken(token);
      setUser(usuario);

      toast.success('¡Registro exitoso!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al registrarse';
      toast.error(message);
      throw new Error(message);
    }
  };

  const registerSolicitante = async (data: RegistroSolicitanteData) => {
    try {
      const response = await authApi.registroSolicitante(data);
      const { token, usuario } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(usuario));

      setToken(token);
      setUser(usuario);

      toast.success('¡Registro exitoso!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al registrarse';
      toast.error(message);
      throw new Error(message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, registerOferente, registerSolicitante }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};