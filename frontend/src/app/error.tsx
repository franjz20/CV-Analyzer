'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h1 className="mt-4 text-xl font-bold text-slate-900">Algo salió mal</h1>
        <p className="mt-2 text-sm text-slate-600">
          Ocurrió un error inesperado. Podés intentar de nuevo o volver al inicio.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => retry()}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Reintentar
          </button>
          <Link
            href="/"
            className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
