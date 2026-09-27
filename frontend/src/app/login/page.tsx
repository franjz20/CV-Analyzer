'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api, { mensajeError } from '@/lib/api';
import { esEmailValido } from '@/lib/validaciones';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errores, setErrores] = useState<{ email?: string; password?: string }>({});
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  const validar = () => {
    const nuevosErrores: typeof errores = {};
    if (!esEmailValido(email)) nuevosErrores.email = 'Ingresá un email válido (ej: nombre@gmail.com)';
    if (!password) nuevosErrores.password = 'Ingresá tu contraseña';
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validar()) return;
    setCargando(true);

    try {
      const res = await api.post('/auth/login', { email: email.trim(), password });
      localStorage.setItem('token', res.data.access_token);
      router.push('/dashboard');
    } catch (err: any) {
        setError(mensajeError(err, 'Credenciales incorrectas'));
    } finally {
        setCargando(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <Link href="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← Volver al inicio
        </Link>
        <h1 className="mt-4 mb-6 text-2xl font-bold">Iniciar sesión</h1>

        {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <label className="mb-1 block text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => email && !esEmailValido(email) && setErrores((p) => ({ ...p, email: 'Ingresá un email válido (ej: nombre@gmail.com)' }))}
          placeholder="nombre@gmail.com"
          className={`mb-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 ${errores.email ? 'border-red-400' : 'border-slate-300'}`}
        />
        {errores.email && <p className="mb-2 text-xs text-red-500">{errores.email}</p>}
        {!errores.email && <div className="mb-2" />}

        <label className="mb-1 block text-sm font-medium">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`mb-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 ${errores.password ? 'border-red-400' : 'border-slate-300'}`}
        />
        {errores.password && <p className="mb-2 text-xs text-red-500">{errores.password}</p>}
        {!errores.password && <div className="mb-4" />}

        <button
          type="submit"
          disabled={cargando}
          className="w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>

        <p className="mt-4 text-center text-sm text-slate-600">
          ¿No tenés cuenta? <Link href="/registro" className="font-medium text-indigo-600 hover:text-indigo-700">Registrate</Link>
        </p>
      </form>
    </div>
  );
}
