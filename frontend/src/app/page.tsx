import Link from 'next/link';
import { AuthNav, CtaLink } from '@/components/auth-cta';

const caracteristicas = [
  {
    titulo: 'Puntuación instantánea',
    descripcion: 'Obtené un puntaje del 1 al 100 que refleja qué tan competitivo está tu CV frente a otros candidatos.',
    icono: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5l6-6 4 4 8-8M15 5.5h6v6" />
      </svg>
    ),
  },
  {
    titulo: 'Feedback accionable',
    descripcion: 'Sugerencias concretas por sección: qué destacar, qué corregir y qué palabras clave agregar.',
    icono: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    titulo: 'Reescritura con IA',
    descripcion: 'Con el plan Pro, la IA reescribe tu resumen profesional para que cause una mejor primera impresión.',
    icono: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3zm7 11l.9 2.4L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.6L19 14z" />
      </svg>
    ),
  },
];

const pasos = [
  { numero: '1', titulo: 'Creá tu cuenta', descripcion: 'Registrate gratis en menos de un minuto. Sin tarjeta.' },
  { numero: '2', titulo: 'Subí tu CV en PDF', descripcion: 'Arrastrá tu archivo y nuestra IA extrae y analiza el contenido.' },
  { numero: '3', titulo: 'Recibí tu análisis', descripcion: 'Puntuación, puntos fuertes y mejoras concretas en segundos.' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            CV Analyzer
          </Link>
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#caracteristicas" className="hover:text-slate-900 transition-colors">Características</a>
            <a href="#como-funciona" className="hover:text-slate-900 transition-colors">Cómo funciona</a>
            <Link href="/pricing" className="hover:text-slate-900 transition-colors">Precios</Link>
          </div>
          <div className="flex items-center gap-4">
            <AuthNav />
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-indigo-100 blur-3xl opacity-60" />
        <div className="pointer-events-none absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-sky-100 blur-3xl opacity-60" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2l1.7 4.6L16 8l-4.3 1.4L10 14l-1.7-4.6L4 8l4.3-1.4L10 2z" />
              </svg>
              Análisis con inteligencia artificial
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Tu CV, analizado por IA en{' '}
              <span className="text-indigo-600">segundos</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-slate-600">
              Subí tu currículum en PDF y recibí una puntuación del 1 al 100 con sugerencias concretas para conseguir más entrevistas.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <CtaLink className="rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors" />
              <Link
                href="/pricing"
                className="rounded-lg border border-slate-300 px-6 py-3 text-base font-semibold text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition-colors"
              >
                Ver planes
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-500">3 análisis gratis · No se requiere tarjeta</p>
          </div>

          {/* Mock de resultado */}
          <div className="relative">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">Resultado del análisis</h3>
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">Completado</span>
              </div>
              <div className="mt-5 flex items-center gap-5">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-2xl font-bold text-white">
                  87
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">Puntuación general</p>
                  <div className="mt-2 h-2.5 w-full rounded-full bg-slate-100">
                    <div className="h-2.5 w-[87%] rounded-full bg-indigo-600" />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">Mejor que el 72% de los CVs analizados</p>
                </div>
              </div>
              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">✓</span>
                  <span className="text-slate-600">Experiencia laboral bien estructurada y con logros medibles</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">✓</span>
                  <span className="text-slate-600">Sección de habilidades alineada con el puesto buscado</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs font-bold">!</span>
                  <span className="text-slate-600">Falta un resumen profesional al inicio del documento</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs font-bold">!</span>
                  <span className="text-slate-600">Agregá palabras clave del puesto para superar filtros ATS</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Características */}
      <section id="caracteristicas" className="border-t border-slate-100 bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Todo lo que necesitás para destacar</h2>
            <p className="mt-3 text-slate-600">Feedback claro y accionable, generado por IA en español.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {caracteristicas.map((c) => (
              <div key={c.titulo} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  {c.icono}
                </div>
                <h3 className="mt-4 font-semibold">{c.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Cómo funciona</h2>
            <p className="mt-3 text-slate-600">Tres pasos y ya tenés tu análisis.</p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {pasos.map((p) => (
              <div key={p.numero} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
                  {p.numero}
                </div>
                <h3 className="mt-4 font-semibold">{p.titulo}</h3>
                <p className="mt-2 text-sm text-slate-600">{p.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-2xl bg-indigo-600 px-8 py-14 text-center text-white">
          <h2 className="text-3xl font-bold">¿Listo para mejorar tu CV?</h2>
          <p className="mx-auto mt-3 max-w-xl text-indigo-100">
            Creá tu cuenta gratis y obtené tu primer análisis en menos de un minuto.
          </p>
          <CtaLink className="mt-8 inline-block rounded-lg bg-white px-8 py-3 text-base font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors" />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-500 sm:flex-row">
          <p>© 2026 CV Analyzer</p>
          <div className="flex gap-6">
            <Link href="/pricing" className="hover:text-slate-700 transition-colors">Precios</Link>
            <Link href="/login" className="hover:text-slate-700 transition-colors">Iniciar sesión</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
