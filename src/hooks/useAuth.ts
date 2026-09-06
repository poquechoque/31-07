import { useAuth as useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useAuthContext();
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};