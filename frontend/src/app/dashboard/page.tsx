'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';

export default function DashboardPage() {

  const [archivo, setArchivo] = useState<File | null>(null);
  const [resultado, setResultado] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token')
    if(!token) router.push('/login');
  }, [router]);

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    if(!archivo) return;

    setError('');
    setResultado('');
    setCargando(true);

    const formData = new FormData();
    formData.append('cv', archivo);

    try {
      const res = await api.post('/analisis/analizar', formData, {
        headers: {'Content-Type' : 'multipart/form-data'}
      });

      setResultado(res.data.resultado);
    } catch (err: any) {
        setError(err.response?.data?.message || 'Error al analizar el CV');
    } finally {
        setCargando(false);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Analizador de CV</h1>
          <button onClick={cerrarSesion} className="text-sm text-red-600">
            Cerrar sesión
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
          <label className="block text-sm font-medium mb-2">Subí tu CV (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setArchivo(e.target.files?.[0] || null)}
            required
            className="w-full border rounded px-3 py-2 mb-4"
          />

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {cargando ? 'Analizando...' : 'Analizar CV'}
          </button>
        </form>

        {resultado && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="font-bold mb-2">Resultado del análisis</h2>
            <p className="whitespace-pre-line text-sm">{resultado}</p>
          </div>
        )}
      </div>
    </div>
  );
}
