import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RedisStore } from 'connect-redis';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { createClient } from 'redis';

import { parseBooleanUtils } from '@/utils/parse-boolean.utils';
import { ms, StringValue } from '@/utils/time-to-ms.utils';

import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const config = app.get(ConfigService);
	const redis = createClient({ url: config.getOrThrow<string>('REDIS_URI') });
	await redis.connect();

	app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));
	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	app.use(
		session({
			secret: config.getOrThrow<string>('SESSION_SECRET'),
			name: config.getOrThrow<string>('SESSION_NAME'),
			resave: true,
			saveUninitialized: false,
			cookie: {
				domain: config.getOrThrow<string>('SESSION_DOMAIN'),
				maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
				httpOnly: parseBooleanUtils(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
				secure: parseBooleanUtils(config.getOrThrow<string>('SESSION_SECURE')),
				sameSite: 'lax',
			},
			store: new RedisStore({
				client: redis,
				prefix: config.getOrThrow<string>('SESSION_FOLDER'),
			}),
		}),
	);

	app.enableCors({
		origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
		credentials: true,
		exposeHeaders: ['set-cookie'],
	});

	await app.listen(config.getOrThrow<number>('APPLICATION_PORT'));
}

bootstrap();
