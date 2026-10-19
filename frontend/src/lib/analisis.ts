export interface Mejora {
  seccion: string;
  problema: string;
  sugerencia: string;
}

export interface ResultadoAnalisis {
  puntuacion: number;
  resumenGeneral?: string;
  puntosFuertes?: string[];
  mejoras?: Mejora[];
  agregar?: string[];
  eliminar?: string[];
  resumenReescrito?: string;
}

// Parsea el resultado del backend; devuelve null si no es JSON (resultados viejos en texto plano)
export function parsearResultado(raw: unknown): ResultadoAnalisis | null {
  try {
    const parsed = typeof raw === 'string'
      ? JSON.parse(raw.replace(/```json|```/g, '').trim())
      : raw;
    if (typeof parsed?.puntuacion !== 'number') return null;
    return parsed as ResultadoAnalisis;
  } catch {
    return null;
  }
}

export function colorPuntuacion(p: number) {
  if (p >= 75) return { text: 'text-green-600', bg: 'bg-green-600', badge: 'bg-green-50 text-green-700' };
  if (p >= 50) return { text: 'text-amber-600', bg: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700' };
  return { text: 'text-red-600', bg: 'bg-red-500', badge: 'bg-red-50 text-red-700' };
}
