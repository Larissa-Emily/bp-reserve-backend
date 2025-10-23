import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ✅ Habilita CORS
  app.enableCors({
    origin: 'http://localhost:5173',  // URL do teu frontend (Vite geralmente usa 5173)
    credentials: true,
  });

  await app.listen(3000);
}

bootstrap();
