import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
// import * as pdfParse from 'pdf-parse';
import { PDFParse } from 'pdf-parse';

import { Analisis } from './analisis.entity';
import { Usuario } from '../usuarios/usuario.entity';

@Injectable()
export class AnalisisService {
  private genAI: GoogleGenAI;

  constructor(
    @InjectRepository(Analisis)
    private analisisRepository: Repository<Analisis>,
    private configService: ConfigService,
  ) {
    this.genAI = new GoogleGenAI({
      apiKey: this.configService.get<string>('GEMINI_API_KEY'),
    });
  }

  async contarAnalisisDelUsuario(usuarioId: string): Promise<number> {
    return this.analisisRepository.count({
      where: { usuario: { id: usuarioId } },
    });
  }

  async analizarCV(archivo: Express.Multer.File, usuario: Usuario): Promise<Analisis> {
    const LIMITE_GRATIS = 3;

    if (usuario.plan === 'gratis') {
      const cantidad = await this.contarAnalisisDelUsuario(usuario.id);
      if (cantidad >= LIMITE_GRATIS) {
        throw new ForbiddenException(
          `Llegaste al límite de ${LIMITE_GRATIS} análisis gratis. Actualizá a Pro para análisis ilimitados.`,
        );
      }
    }

    // 1. Extraer texto del PDF
    const parser = new PDFParse({data: archivo.buffer});
    const pdfData = await parser.getText(); // Extraer el texto del PDF
    const textoPDF = pdfData.text;

    // 2. Prompt distinto según el plan
    const prompt = usuario.plan === 'pro'
      ? `Analizá este CV en profundidad y devolvé en español:
         1. Puntuación general del 1 al 100
         2. Puntos fuertes (detallado)
         3. Puntos a mejorar (detallado)
         4. Sugerencias concretas por sección
         5. Una versión reescrita del "Sobre mí" o resumen profesional
         
         CV:
         ${textoPDF}`
      : `Analizá este CV de forma breve y devolvé en español:
         1. Puntuación general del 1 al 100
         2. Un resumen corto de 3-4 líneas con lo más importante a mejorar
         
         CV:
         ${textoPDF}`;

    // 3. Enviar a Gemini
    const response = await this.genAI.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    const resultado = response.text ?? '';

    // 4. Guardar resultado
    const analisis = this.analisisRepository.create({ usuario, resultado });
    return this.analisisRepository.save(analisis);
  }
}