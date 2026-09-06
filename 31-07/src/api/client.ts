// src/api/client.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ FIX: si el body es FormData (subida de archivos), quitamos el
    // Content-Type: application/json fijado por defecto en la instancia.
    // Si no lo quitamos, Axios convierte el FormData a JSON con
    // formDataToJSON() y los archivos (File) terminan como "{}",
    // rompiendo la subida de imágenes (fotoPrincipal, fotografias).
    // Al quitar el header, Axios deja el FormData intacto y el navegador
    // genera el Content-Type correcto con el boundary multipart.
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;