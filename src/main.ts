import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    // origin: 'http://localhost:8080', //only allow this domain to access
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Panda Wallet example')
    .setDescription('Panda Wallet API description')
    .setVersion('1.0')
    .addTag('Panda Wallet')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1', app, document);

  await app.listen(3000);
}
bootstrap();
