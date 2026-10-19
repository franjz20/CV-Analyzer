import Link from 'next/link';
import Logo from '@/components/logo';

export default function PagoExitosoPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex justify-center"><Logo className="justify-center" /></div>
        <div className="mx-auto mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">¡Pago exitoso!</h1>
        <p className="mt-2 text-sm text-slate-600">
          Tu cuenta ya fue actualizada al plan Pro. Ahora tenés análisis ilimitados y sugerencias detalladas.
        </p>
        <Link
          href="/dashboard"
          className="mt-8 inline-block rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white hover:bg-indigo-700 transition-colors"
        >
          Ir al Dashboard
        </Link>
      </div>
    </div>
  );
}
