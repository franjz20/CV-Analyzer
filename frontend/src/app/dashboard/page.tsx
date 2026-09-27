'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api, { mensajeError } from '@/lib/api';

const MAX_MB = 5;

export default function DashboardPage() {

  const [archivo, setArchivo] = useState<File | null>(null);
  const [nombreArchivo, setNombreArchivo] = useState('');
  const [resultado, setResultado] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token')
    if(!token) router.push('/login');
  }, [router]);

  const handleArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setError('');

    if (!file) {
      setArchivo(null);
      setNombreArchivo('');
      return;
    }
    if (file.type !== 'application/pdf') {
      setArchivo(null);
      setNombreArchivo('');
      setError('Solo se aceptan archivos PDF.');
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setArchivo(null);
      setNombreArchivo('');
      setError(`El archivo supera el máximo de ${MAX_MB}MB.`);
      return;
    }

    setArchivo(file);
    setNombreArchivo(file.name);
  };

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    if(!archivo || cargando) return;

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
        setError(mensajeError(err, 'Error al analizar el CV'));
    } finally {
        setCargando(false);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-2xl font-bold">CV Analyzer</Link>
          <div className="flex gap-4 items-center">
            <Link href="/pricing" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Actualizar a Pro</Link>
            <button onClick={cerrarSesion} className="text-sm font-medium text-red-600 hover:text-red-700">
              Cerrar sesión
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
          <label className="block text-sm font-medium mb-2">Subí tu CV (PDF, máx. {MAX_MB}MB)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleArchivo}
            required
            className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-1 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-indigo-700"
          />
          {nombreArchivo && !error && (
            <p className="text-xs text-slate-500 mb-3">Archivo seleccionado: {nombreArchivo}</p>
          )}

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-red-600 text-sm mb-4 mt-2">{error}</p>}
          {!error && <div className="mb-3" />}

          <button
            type="submit"
            disabled={cargando || !archivo}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {cargando ? 'Analizando...' : 'Analizar CV'}
          </button>
        </form>

        {resultado && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="font-bold mb-2">Resultado del análisis</h2>
            <p className="whitespace-pre-line text-sm text-slate-700">{resultado}</p>
          </div>
        )}
      </div>
    </div>
  );
}
