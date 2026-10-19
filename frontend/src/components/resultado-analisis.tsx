import { ResultadoAnalisis, colorPuntuacion } from '@/lib/analisis';

function Titulo({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{children}</h3>;
}

function IconoCheck() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

export default function ResultadoAnalisisView({ resultado }: { resultado: ResultadoAnalisis }) {
  const c = colorPuntuacion(resultado.puntuacion);
  const porcentaje = Math.max(0, Math.min(100, resultado.puntuacion));

  return (
    <div className="space-y-6">
      {/* Puntuación */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className={`flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full ${c.badge} ring-8 ring-slate-50`}>
            <span className="text-3xl font-extrabold">{resultado.puntuacion}</span>
            <span className="text-[10px] font-medium opacity-70">de 100</span>
          </div>
          <div className="min-w-0 flex-1">
            <Titulo>Puntuación general</Titulo>
            <div className="mt-2 h-2.5 w-full rounded-full bg-slate-100">
              <div className={`h-2.5 rounded-full ${c.bg} transition-all`} style={{ width: `${porcentaje}%` }} />
            </div>
            {resultado.resumenGeneral && (
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{resultado.resumenGeneral}</p>
            )}
          </div>
        </div>
      </div>

      {/* Puntos fuertes */}
      {!!resultado.puntosFuertes?.length && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <Titulo>Puntos fuertes</Titulo>
          <ul className="mt-3 space-y-2.5">
            {resultado.puntosFuertes.map((p, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                <IconoCheck />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mejoras */}
      {!!resultado.mejoras?.length && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <Titulo>Puntos a mejorar</Titulo>
          <ul className="mt-3 space-y-3">
            {resultado.mejoras.map((m, i) => (
              <li key={i} className="rounded-lg border border-amber-200 bg-amber-50/60 p-4">
                <span className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                  {m.seccion}
                </span>
                <p className="mt-2 text-sm font-medium text-slate-800">{m.problema}</p>
                <p className="mt-1 text-sm text-slate-600">
                  <span className="font-medium text-slate-700">Sugerencia: </span>{m.sugerencia}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Agregar / Eliminar */}
      {(!!resultado.agregar?.length || !!resultado.eliminar?.length) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {!!resultado.agregar?.length && (
            <div className="rounded-xl border border-green-200 bg-green-50/50 p-5">
              <Titulo>Qué agregar</Titulo>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {resultado.agregar.map((a, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 font-bold text-green-600">+</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!!resultado.eliminar?.length && (
            <div className="rounded-xl border border-red-200 bg-red-50/50 p-5">
              <Titulo>Qué eliminar</Titulo>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {resultado.eliminar.map((e, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 font-bold text-red-600">−</span>
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Resumen reescrito (Pro) */}
      {resultado.resumenReescrito && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
          <div className="flex items-center gap-2">
            <Titulo>Tu resumen profesional, reescrito</Titulo>
            <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">Pro</span>
          </div>
          <blockquote className="mt-3 border-l-4 border-indigo-300 pl-4 text-sm italic leading-relaxed text-slate-700">
            {resultado.resumenReescrito}
          </blockquote>
        </div>
      )}
    </div>
  );
}
