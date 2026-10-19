import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PDFParse } from 'pdf-parse';

import { Analisis } from './analisis.entity';
import { Usuario } from '../usuarios/usuario.entity';
import { IaService, ResultadoAnalisis } from './ia.service';

@Injectable()
export class AnalisisService {
  constructor(
    @InjectRepository(Analisis)
    private analisisRepository: Repository<Analisis>,
    private iaService: IaService,
  ) {}

  async contarAnalisisDelUsuario(usuarioId: string): Promise<number> {
    return this.analisisRepository.count({
      where: { usuario: { id: usuarioId } },
    });
  }

  async analizarCV(archivo: Express.Multer.File, usuario: Usuario) {
    const LIMITE_GRATIS = 3;
    const plan = usuario.plan?.trim();

    if (plan === 'gratis') {
      const cantidad = await this.contarAnalisisDelUsuario(usuario.id);
      if (cantidad >= LIMITE_GRATIS) {
        throw new ForbiddenException(
          `Llegaste al límite de ${LIMITE_GRATIS} análisis gratis. Actualizá a Pro para análisis ilimitados.`,
        );
      }
    }

    // 1. Extraer texto del PDF
    let textoPDF: string;
    try {
      const parser = new PDFParse({data: archivo.buffer});
      const pdfData = await parser.getText(); // Extraer el texto del PDF
      textoPDF = pdfData.text;
    } catch {
      throw new BadRequestException('No se pudo leer el PDF. Verificá que el archivo no esté dañado o protegido.');
    }

    if (!textoPDF?.trim()) {
      throw new BadRequestException('El PDF no contiene texto legible.');
    }

    // 2. Prompt distinto según el plan
    const prompt = plan === 'pro'
      ? this.promptPro(textoPDF)
      : this.promptGratis(textoPDF);

    // 3. Enviar a la IA (Gemini, con Groq de respaldo si falla)
    const resultado = await this.iaService.generar(prompt);

    // 4. Guardar resultado (como JSON) y devolverlo parseado
    const analisis = this.analisisRepository.create({
      usuario,
      resultado: JSON.stringify(resultado),
    });
    const guardado = await this.analisisRepository.save(analisis);

    return { ...guardado, resultado };
  }

  private promptGratis(textoCV: string): string {
    return `Sos un experto en reclutamiento y redacción de currículums. Analizá el siguiente CV y devolvé ÚNICAMENTE un JSON válido (sin markdown, sin texto extra) con esta estructura exacta:

{
  "puntuacion": <número del 1 al 100 según qué tan competitivo está el CV>,
  "resumenGeneral": "<evaluación breve de 2-3 oraciones con lo más importante>",
  "mejoras": [
    {"seccion": "<sección del CV>", "problema": "<qué está mal>", "sugerencia": "<cómo mejorarlo>"}
  ]
}

Reglas:
- Respondé en español
- Incluí exactamente 3 mejoras: las de mayor impacto
- Sé específico: mencioná secciones y contenido real del CV

CV:
${textoCV}`;
  }

  private promptPro(textoCV: string): string {
    return `Sos un experto en reclutamiento y redacción de currículums. Analizá el siguiente CV en profundidad y devolvé ÚNICAMENTE un JSON válido (sin markdown, sin texto extra) con esta estructura exacta:

{
  "puntuacion": <número del 1 al 100 según qué tan competitivo está el CV>,
  "resumenGeneral": "<evaluación breve de 2-3 oraciones>",
  "puntosFuertes": ["<punto fuerte concreto del CV>", ...],
  "mejoras": [
    {"seccion": "<sección del CV>", "problema": "<qué está mal>", "sugerencia": "<cómo mejorarlo concreto>"}
  ],
  "agregar": ["<elemento concreto que falta y conviene sumar>", ...],
  "eliminar": ["<elemento que resta valor y conviene quitar>", ...],
  "resumenReescrito": "<versión mejorada del resumen profesional o 'Sobre mí'>"
}

Reglas:
- Respondé en español
- Sé específico: mencioná secciones y contenido real del CV, nada genérico
- Priorizá las mejoras de mayor impacto para conseguir entrevistas
- En "agregar" pensá en palabras clave, métricas y secciones que los filtros ATS buscan
- Si el CV no tiene resumen profesional, escribí uno sugerido en "resumenReescrito"

CV:
${textoCV}`;
  }
}
