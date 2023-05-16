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
    .setDescription('Panda Wallet API description')
    .setTitle('Panda Wallet example')
    .addTag('Panda Wallet')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1', app, document);

  await app.listen(3000);
}
bootstrap();
