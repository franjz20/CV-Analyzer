import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <p className="text-6xl font-extrabold text-indigo-600">404</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Página no encontrada</h1>
        <p className="mt-2 text-slate-600">La página que buscás no existe o fue movida.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
