import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  // Aviso temprano en logs si faltan variables críticas
  const requeridas = ['DATABASE_HOST', 'DATABASE_PORT', 'DATABASE_USER', 'DATABASE_PASSWORD', 'DATABASE_NAME', 'JWT_SECRET'];
  const faltantes = requeridas.filter((v) => !process.env[v]);
  if (faltantes.length) {
    console.error(`Faltan variables de entorno: ${faltantes.join(', ')}`);
  }

  const app = await NestFactory.create(AppModule, {rawBody: true});

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Orígenes permitidos: FRONTEND_URL puede tener varios separados por coma
  const origenesPermitidos = (process.env.FRONTEND_URL || 'http://localhost:3001')
    .split(',')
    .map((o) => o.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Requests sin Origin (curl, server-to-server) o de orígenes configurados
      if (!origin || origenesPermitidos.includes(origin)) {
        return callback(null, true);
      }
      // Deploys y previews de este proyecto en Vercel (https://cv-analyzer-*.vercel.app)
      if (/^https:\/\/cv-analyzer[a-z0-9-]*\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
