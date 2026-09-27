import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    timeout: 60_000, // 60s: el análisis con IA puede tardar
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if(token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Sin respuesta: servidor caído, timeout o problema de red
    if (!error.response) {
      error.friendlyMessage = 'No se pudo conectar con el servidor. Verificá tu conexión e intentá de nuevo.';
    } else if (error.response.status === 401) {
      // Token vencido o inválido: limpiar sesión y mandar al login
      localStorage.removeItem('token');
      if (!['/login', '/registro'].includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    } else if (error.response.status === 429) {
      error.friendlyMessage = 'Demasiadas solicitudes. Esperá un minuto e intentá de nuevo.';
    } else if (error.response.status >= 500) {
      error.friendlyMessage = 'Error del servidor. Intentá de nuevo más tarde.';
    }

    return Promise.reject(error);
  },
);

// Extrae un mensaje legible de cualquier error de la API
export function mensajeError(err: any, fallback: string): string {
  const msg = err?.response?.data?.message;
  if (Array.isArray(msg)) return msg.join('. ');
  return err?.friendlyMessage || msg || fallback;
}

export default api;

// Esto centraliza todas las llamadas al backend y 
// agrega automáticamente el token JWT a cada petición.
