import Link from 'next/link';

export default function PagoCanceladoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center bg-white p-10 rounded-lg shadow max-w-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Pago cancelado</h1>
        <p className="text-gray-600 mb-6">
          No se completó el pago. Podés intentarlo de nuevo cuando quieras.
        </p>
        <Link href="/pricing" className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Volver a Pricing
        </Link>
      </div>
    </div>
  );
}