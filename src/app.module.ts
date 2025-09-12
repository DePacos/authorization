import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@/auth/auth.module';
import { MailModule } from '@/mail/mail.module';
import { UserModule } from '@/user/user.module';
import { IS_DEV_ENV } from '@/utils/is-dev.utils';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			ignoreEnvFile: !IS_DEV_ENV,
		}),
		AuthModule,
		UserModule,
		MailModule,
	],
})
export class AppModule {}
