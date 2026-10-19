import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

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

@Injectable()
export class IaService {
  private _genAI?: GoogleGenAI;

  constructor(private configService: ConfigService) {}

  // Inicialización lazy: si falta la key no tira el arranque del server
  private get genAI(): GoogleGenAI {
    if (!this._genAI) {
      this._genAI = new GoogleGenAI({
        apiKey: this.configService.get<string>('GEMINI_API_KEY'),
      });
    }
    return this._genAI;
  }

  // Intenta Gemini primero (con reintento); si falla usa Groq de respaldo
  async generar(prompt: string): Promise<ResultadoAnalisis> {
    const errores: string[] = [];

    if (this.configService.get('GEMINI_API_KEY')) {
      try {
        return await this.conReintento(() => this.conGemini(prompt));
      } catch (e: any) {
        errores.push(`Gemini: ${e?.message ?? e}`);
        console.error('Gemini falló, probando respaldo:', e?.message ?? e);
      }
    }

    if (this.configService.get('GROQ_API_KEY')) {
      try {
        return await this.conReintento(() => this.conGroq(prompt));
      } catch (e: any) {
        errores.push(`Groq: ${e?.message ?? e}`);
      }
    }

    console.error('Todos los proveedores de IA fallaron:', errores);
    throw new ServiceUnavailableException(
      'El servicio de análisis no está disponible en este momento. Intentá de nuevo más tarde.',
    );
  }

  // Un reintento extra por si el proveedor está saturado momentáneamente
  private async conReintento(fn: () => Promise<ResultadoAnalisis>): Promise<ResultadoAnalisis> {
    try {
      return await fn();
    } catch {
      await new Promise((r) => setTimeout(r, 1500));
      return fn();
    }
  }

  private async conGemini(prompt: string): Promise<ResultadoAnalisis> {
    const response = await this.genAI.models.generateContent({
      model: this.configService.get('GEMINI_MODEL') || 'gemini-3.6-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });
    return this.parsearJson(response.text ?? '');
  }

  // Groq es compatible con la API de OpenAI: fetch directo, sin SDK extra
  private async conGroq(prompt: string): Promise<ResultadoAnalisis> {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.configService.get<string>('GROQ_API_KEY')}`,
      },
      body: JSON.stringify({
        model: this.configService.get('GROQ_MODEL') || 'openai/gpt-oss-120b',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.4,
      }),
      signal: AbortSignal.timeout(45_000),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
    }

    const data = await res.json();
    return this.parsearJson(data.choices?.[0]?.message?.content ?? '');
  }

  private parsearJson(texto: string): ResultadoAnalisis {
    // Por si el modelo envuelve el JSON en ```json ... ``` o agrega texto extra
    const limpio = texto.replace(/```json|```/g, '').trim();
    let parsed: any;
    try {
      parsed = JSON.parse(limpio);
    } catch {
      const ini = limpio.indexOf('{');
      const fin = limpio.lastIndexOf('}');
      if (ini === -1 || fin <= ini) throw new Error('La respuesta de la IA no es JSON');
      parsed = JSON.parse(limpio.slice(ini, fin + 1));
    }

    if (typeof parsed?.puntuacion !== 'number') {
      throw new Error('La respuesta de la IA no tiene el formato esperado');
    }

    return parsed;
  }
}
