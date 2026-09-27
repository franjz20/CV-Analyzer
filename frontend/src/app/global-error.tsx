'use client';

export default function GlobalError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <title>Error - CV Analyzer</title>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>Algo salió mal</h1>
            <p style={{ marginTop: '0.5rem', color: '#475569' }}>
              Ocurrió un error inesperado. Intentá recargar la página.
            </p>
            <button
              onClick={() => retry()}
              style={{
                marginTop: '1.5rem',
                padding: '0.6rem 1.5rem',
                background: '#4f46e5',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Reintentar
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
