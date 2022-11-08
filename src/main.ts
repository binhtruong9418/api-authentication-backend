import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './config/exception.filter';
import { ResponseInterceptor } from './config/reponse.interceptor';
import * as cookieParser from 'cookie-parser';

const configSwagger = async (app: INestApplication) => {
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('User Swagger')
    .setDescription('The user API description')
    .setVersion('1.0')
    .addTag('user')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
};

const configValidationPipe = async (app: INestApplication) => {
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  configSwagger(app);
  configValidationPipe(app);
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter())
  app.use(cookieParser());

  await app.listen(Number(process.env.PORT) || 80);
}
bootstrap().then(() => console.log(`Server is running on port ${process.env.PORT}`));
