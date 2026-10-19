import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Analisis } from './analisis.entity';
import { AnalisisService } from './analisis.service';
import { AnalisisController } from './analisis.controller';
import { IaService } from './ia.service';

@Module({
  imports: [TypeOrmModule.forFeature([Analisis])],
  providers: [AnalisisService, IaService],
  controllers: [AnalisisController]
})
export class AnalisisModule {}
