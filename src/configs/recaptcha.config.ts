import { ConfigService } from '@nestjs/config';
import { GoogleRecaptchaModuleOptions } from '@nestlab/google-recaptcha';
import { Request } from 'express';

import { isDev } from '@/utils/is-dev.utils';

export const getRecaptchaConfig = (configService: ConfigService): GoogleRecaptchaModuleOptions => ({
	secretKey: configService.getOrThrow<string>('RECAPTCHA_KEY'),
	response: (request: Request) => request.headers.recaptcha as string,
	skipIf: isDev(configService),
});
