import Link from 'next/link';
import Logo from '@/components/logo';

export default function PagoCanceladoPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex justify-center"><Logo className="justify-center" /></div>
        <div className="mx-auto mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Pago cancelado</h1>
        <p className="mt-2 text-sm text-slate-600">
          No se completó el pago. Podés intentarlo de nuevo cuando quieras — tu cuenta sigue en el plan gratis.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/pricing"
            className="rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Reintentar
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-slate-300 px-6 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Ir al Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
