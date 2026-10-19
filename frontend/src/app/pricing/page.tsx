'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api, { mensajeError } from '@/lib/api';
import Logo from '@/components/logo';

function Check() {
  return (
    <svg className="h-4 w-4 shrink-0 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function Cruz() {
  return (
    <svg className="h-4 w-4 shrink-0 text-slate-300" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function PricingPage(){
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handlePago = async () => {
    setError('');
    setCargando(true);

    const token = localStorage.getItem('token');
    if(!token){
      router.push('/login');
      return;
    }

    try{
      const res = await api.post('/pagos/crear-sesion');
      window.location.href = res.data.url;
    } catch (err: any) {
        setError(mensajeError(err, 'Error al iniciar el pago'));
        setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Logo />
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-14">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Planes simples y transparentes</h1>
          <p className="mt-3 text-slate-600">Empezá gratis y actualizá cuando necesites análisis ilimitados.</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Plan Gratis */}
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Gratis</h2>
            <p className="mt-1 text-sm text-slate-500">Para probar el servicio</p>
            <p className="mt-4 text-4xl font-extrabold text-slate-900">$0</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2.5"><Check /> Hasta 3 análisis</li>
              <li className="flex items-center gap-2.5"><Check /> Puntuación general</li>
              <li className="flex items-center gap-2.5"><Check /> Top 3 mejoras de mayor impacto</li>
              <li className="flex items-center gap-2.5 text-slate-400"><Cruz /> Análisis ilimitados</li>
              <li className="flex items-center gap-2.5 text-slate-400"><Cruz /> Sugerencias detalladas y reescritura</li>
            </ul>
            <button
              disabled
              className="mt-8 w-full cursor-not-allowed rounded-lg bg-slate-100 py-2.5 font-semibold text-slate-400"
            >
              Plan actual
            </button>
          </div>

          {/* Plan Pro */}
          <div className="relative rounded-xl border-2 border-indigo-600 bg-white p-8 shadow-md">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              Recomendado
            </span>
            <h2 className="text-lg font-bold text-slate-900">Pro</h2>
            <p className="mt-1 text-sm text-slate-500">Para buscar trabajo en serio</p>
            <p className="mt-4 text-4xl font-extrabold text-slate-900">
              $5<span className="text-base font-medium text-slate-500">/mes</span>
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2.5"><Check /> Análisis ilimitados</li>
              <li className="flex items-center gap-2.5"><Check /> Puntuación general</li>
              <li className="flex items-center gap-2.5"><Check /> Puntos fuertes y mejoras detalladas</li>
              <li className="flex items-center gap-2.5"><Check /> Qué agregar y qué eliminar</li>
              <li className="flex items-center gap-2.5"><Check /> Reescritura del resumen profesional</li>
            </ul>

            {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

            <button
              onClick={handlePago}
              disabled={cargando}
              className="mt-8 w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {cargando ? 'Redirigiendo...' : 'Actualizar a Pro'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
