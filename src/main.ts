import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

import { getCorsConfig, getSessionConfig } from '@/configs';

import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const configService = app.get(ConfigService);
	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	app.use(session(await getSessionConfig(configService)));
	app.enableCors(getCorsConfig(configService));

	app.use(cookieParser(configService.getOrThrow<string>('COOKIES_SECRET')));
	await app.listen(configService.getOrThrow<number>('APPLICATION_PORT'));
}

bootstrap();
