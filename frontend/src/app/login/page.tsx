'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
// import api from '@/lib/api'; // Asegúrate de que la ruta sea correcta según tu estructura de carpetas

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.access_token);
      router.push('/dashboard');
    } catch (err: any) {
        setError(err.response?.data?.message || 'Credenciales incorrectas');
    } finally {
        setCargando(false);
    }
  };

  return (
    <>
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6">Iniciar sesión</h1>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <label className="block text-sm font-medium mb-1">Email</label>
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 mb-4"
            />

            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 mb-6"
            />

            <button
            type="submit"
            disabled={cargando}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
            {cargando ? 'Ingresando...' : 'Ingresar'}
            </button>

            <p className="text-sm text-center mt-4">
            ¿No tenés cuenta? <a href="/registro" className="text-blue-600">Registrate</a>
            </p>
        </form>
        </div>
    </>
  );
}