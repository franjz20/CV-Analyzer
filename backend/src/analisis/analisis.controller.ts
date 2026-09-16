import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Request, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { AnalisisService } from './analisis.service';

@Controller('analisis')
export class AnalisisController {
  constructor(private analisisService: AnalisisService) {}

  @Post('analizar')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('cv'))
  async analizarCV(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), //5MB maximo
          new FileTypeValidator({ fileType: 'application/pdf'}),
        ]
      })
  ) archivo: Express.Multer.File, @Request() req) {
    return this.analisisService.analizarCV(archivo, req.user);
  }
}
