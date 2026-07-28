import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
// import * as pdfParse from 'pdf-parse';
// import pdfParse from 'pdf-parse';
import { PDFParse } from 'pdf-parse';
import { Analisis } from './analisis.entity';
import { Usuario } from '../usuarios/usuario.entity';

@Injectable()
export class AnalisisService {
  private anthropic: Anthropic;
  
  constructor(
    @InjectRepository(Analisis)
    private analisisRepository: Repository<Analisis>,
    private configService: ConfigService,
  ) {
    this.anthropic = new Anthropic({
      apiKey: this.configService.get<string>('ANTHROPIC_API_KEY'),
    });
  }

  async analizarCV(archivo: Express.Multer.File, usuario: Usuario): Promise<Analisis> {
    // 1. Extraer el texto del PDF
    // const pdfData = await pdfParse(archivo.buffer);
    // const textoPDF = pdfData.text;
    const parser = new PDFParse({data: archivo.buffer});
    const pdfData = await parser.getText(); // Extraer el texto del PDF
    const textoPDF = pdfData.text;

    // await parser.destroy(); // Liberar recursos del parser (limpieza de memoria)

    // 2. Enviar a Claude para analisis
    const mensaje = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Analizá este CV y devolvé un análisis en español con:
          1. Puntuación general del 1 al 100
          2. Puntos fuertes
          3. Puntos a mejorar
          4. Sugerencias concretas
          
          CV:
          ${textoPDF}`,
        },
      ],
    });

    // 3. Guardar el resultado en la base de datos
    const resultado = mensaje.content[0].type === 'text' ? mensaje.content[0].text: '';
    const analisis = this.analisisRepository.create({
      usuario,
      resultado,
    });

    return this.analisisRepository.save(analisis);
  }
}
