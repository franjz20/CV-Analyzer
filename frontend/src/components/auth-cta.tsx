'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

function useSesion() {
  const [logueado, setLogueado] = useState(false);
  useEffect(() => {
    setLogueado(!!localStorage.getItem('token'));
  }, []);
  return logueado;
}

// Botón principal: "Comenzar gratis" o "Ir al dashboard" si ya hay sesión
export function CtaLink({ className = '' }: { className?: string }) {
  const logueado = useSesion();
  return (
    <Link href={logueado ? '/dashboard' : '/registro'} className={className}>
      {logueado ? 'Ir al dashboard' : 'Comenzar gratis'}
    </Link>
  );
}

// Lado derecho del navbar: login + CTA, o solo "Dashboard" si hay sesión
export function AuthNav() {
  const logueado = useSesion();

  if (logueado) {
    return (
      <Link
        href="/dashboard"
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
      >
        Ir al dashboard
      </Link>
    );
  }

  return (
    <>
      <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
        Iniciar sesión
      </Link>
      <Link
        href="/registro"
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
      >
        Comenzar gratis
      </Link>
    </>
  );
}
