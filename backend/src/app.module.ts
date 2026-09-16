import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { AnalisisModule } from './analisis/analisis.module';
import { PagosModule } from './pagos/pagos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        ssl: { rejectUnauthorized: false },
        autoLoadEntities: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minuto
        limit: 20, //maximo 20 requests por minuto 
      },
    ]),
    UsuariosModule,
    AuthModule,
    AnalisisModule,
    PagosModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  // providers: [UsuariosService], //supuestamente esto daba error porque UsuariosService ya está registrado en UsuariosModule, se repite
  // controllers: [UsuariosController], //supuestamente esto daba error porque UsuariosController ya está registrado en UsuariosModule, se repite
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
