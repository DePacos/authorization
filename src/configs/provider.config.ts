import { ConfigService } from '@nestjs/config';

import { GoogleService } from '@/auth/provider/services/google.service';
import { YandexService } from '@/auth/provider/services/yandex.service';
import { Options } from '@/auth/provider/types/provider-options.types';

export const getProviderConfig = async (configService: ConfigService): Promise<Options> => ({
	baseUrl: configService.getOrThrow<string>('APPLICATION_URL'),
	services: [
		new GoogleService({
			client_id: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
			client_secret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
			scopes: ['email', 'profile'],
		}),
		new YandexService({
			client_id: configService.getOrThrow<string>('YANDEX_CLIENT_ID'),
			client_secret: configService.getOrThrow<string>('YANDEX_CLIENT_SECRET'),
			scopes: ['login:email', 'login:avatar', 'login:info'],
		}),
	],
});
