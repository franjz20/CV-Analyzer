import Link from 'next/link';

export default function PagoExitosoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center bg-white p-10 rounded-lg shadow max-w-md">
        <h1 className="text-2xl font-bold text-green-600 mb-4">¡Pago exitoso! 🎉</h1>
        <p className="text-gray-600 mb-6">
          Tu cuenta ya fue actualizada al plan Pro. Ahora tenés análisis ilimitados y sugerencias detalladas.
        </p>
        <Link href="/dashboard" className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Ir al Dashboard
        </Link>
      </div>
    </div>
  );
}