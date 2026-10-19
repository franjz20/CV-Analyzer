'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api, { mensajeError } from '@/lib/api';
import { parsearResultado } from '@/lib/analisis';
import ResultadoAnalisisView from '@/components/resultado-analisis';
import Logo from '@/components/logo';

const MAX_MB = 5;

export default function DashboardPage() {

  const [archivo, setArchivo] = useState<File | null>(null);
  const [resultadoRaw, setResultadoRaw] = useState('');
  const [arrastrando, setArrastrando] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token')
    if(!token) router.push('/login');
  }, [router]);

  const seleccionarArchivo = (file: File | null) => {
    setError('');

    if (!file) {
      setArchivo(null);
      return;
    }
    if (file.type !== 'application/pdf') {
      setArchivo(null);
      setError('Solo se aceptan archivos PDF.');
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setArchivo(null);
      setError(`El archivo supera el máximo de ${MAX_MB}MB.`);
      return;
    }

    setArchivo(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setArrastrando(false);
    seleccionarArchivo(e.dataTransfer.files?.[0] || null);
  };

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    if(!archivo || cargando) return;

    setError('');
    setResultadoRaw('');
    setCargando(true);

    const formData = new FormData();
    formData.append('cv', archivo);

    try {
      const res = await api.post('/analisis/analizar', formData, {
        headers: {'Content-Type' : 'multipart/form-data'}
      });

      setResultadoRaw(res.data.resultado);
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

  const resultado = parsearResultado(resultadoRaw);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
          <Logo />
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors">
              Actualizar a Pro
            </Link>
            <button onClick={cerrarSesion} className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors">
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-bold text-slate-900">Analizá tu CV</h1>
        <p className="mt-1 text-sm text-slate-600">Subí tu currículum en PDF y la IA te devuelve puntuación y sugerencias.</p>

        <form onSubmit={handleSubmit} className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Dropzone */}
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setArrastrando(true); }}
            onDragLeave={() => setArrastrando(false)}
            onDrop={handleDrop}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors ${
              arrastrando
                ? 'border-indigo-500 bg-indigo-50'
                : archivo
                  ? 'border-green-400 bg-green-50/50'
                  : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              onChange={(e) => seleccionarArchivo(e.target.files?.[0] || null)}
              className="hidden"
            />
            {archivo ? (
              <>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <p className="mt-3 text-sm font-semibold text-slate-800">{archivo.name}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {(archivo.size / 1024 / 1024).toFixed(2)} MB · Click para cambiar
                </p>
              </>
            ) : (
              <>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                  </svg>
                </span>
                <p className="mt-3 text-sm font-semibold text-slate-800">
                  Arrastrá tu CV acá o hacé click para elegirlo
                </p>
                <p className="mt-1 text-xs text-slate-500">PDF · máx. {MAX_MB}MB</p>
              </>
            )}
          </div>

          {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={cargando || !archivo}
            className="mt-4 w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            {cargando ? (
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Analizando...
              </span>
            ) : 'Analizar CV'}
          </button>
        </form>

        {/* Resultado */}
        {resultadoRaw && (
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Resultado del análisis</h2>
            {resultado ? (
              <ResultadoAnalisisView resultado={resultado} />
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="whitespace-pre-line text-sm text-slate-700">{resultadoRaw}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
