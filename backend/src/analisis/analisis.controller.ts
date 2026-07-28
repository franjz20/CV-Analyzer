import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { AnalisisService } from './analisis.service';

@Controller('analisis')
export class AnalisisController {
  constructor(private analisisService: AnalisisService) {}

  @Post('analizar')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('cv'))
  async analizarCV(@UploadedFile() archivo: Express.Multer.File, @Request() req) {
    return this.analisisService.analizarCV(archivo, req.user);
  }
}
