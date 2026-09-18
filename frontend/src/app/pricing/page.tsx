'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';

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
        setError(err.response?.data?.message || 'Error al iniciar de pago');
        setCargando(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-6">
        
        {/* Plan Gratis */}
        <div className="bg-white p-8 rounded-lg shadow border">
          <h2 className="text-xl font-bold mb-2">Gratis</h2>
          <p className="text-3xl font-bold mb-4">$0</p>
          <ul className="space-y-2 text-sm text-gray-600 mb-6">
            <li>✅ Hasta 3 análisis</li>
            <li>✅ Puntuación general</li>
            <li>✅ Resumen breve</li>
            <li>❌ Sugerencias detalladas</li>
            <li>❌ Análisis ilimitados</li>
          </ul>
          <button
            disabled
            className="w-full bg-gray-200 text-gray-500 py-2 rounded cursor-not-allowed"
          >
            Plan actual
          </button>
        </div>

        {/* Plan Pro */}
        <div className="bg-white p-8 rounded-lg shadow border-2 border-blue-600">
          <h2 className="text-xl font-bold mb-2">Pro</h2>
          <p className="text-3xl font-bold mb-4">$5<span className="text-sm font-normal">/mes</span></p>
          <ul className="space-y-2 text-sm text-gray-600 mb-6">
            <li>✅ Análisis ilimitados</li>
            <li>✅ Puntuación general</li>
            <li>✅ Sugerencias detalladas</li>
            <li>✅ Reescritura del resumen profesional</li>
          </ul>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            onClick={handlePago}
            disabled={cargando}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {cargando ? 'Redirigiendo...' : 'Actualizar a Pro'}
          </button>
        </div>

       </div>
      </div>
    </>
  );
}