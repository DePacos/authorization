import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

import { isDev } from '@/utils/is-dev.utils';

export const getMailerConfig = async (configService: ConfigService): Promise<MailerOptions> => ({
	transport: {
		host: configService.getOrThrow<string>('MAIL_HOST'),
		port: configService.getOrThrow<number>('MAIL_PORT'),
		secure: !isDev(configService),
		requireTLS: true,
		auth: {
			user: configService.getOrThrow<string>('MAIL_LOGIN'),
			pass: configService.getOrThrow<string>('MAIL_PASSWORD'),
		},
	},
	defaults: {
		from: configService.getOrThrow<string>('APPLICATION_NAME'),
	},
});
