import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';

import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { EmailConfirmationService } from '@/auth/email-confirmation/email-confirmation.service';
import { PasswordRecoveryService } from '@/auth/password-recovery/password-recovery.service';
import { ProviderModule } from '@/auth/provider/provider.module';
import { TokensService } from '@/auth/tokens/tokens.service';
import { getProviderConfig } from '@/configs/provider.config';
import { getRecaptchaConfig } from '@/configs/recaptcha.config';
import { MailService } from '@/mail/mail.service';
import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/user/user.service';

@Module({
	imports: [
		ProviderModule.registerAsync({
			imports: [ConfigModule],
			useFactory: getProviderConfig,
			inject: [ConfigService],
		}),
		GoogleRecaptchaModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getRecaptchaConfig,
			inject: [ConfigService],
		}),
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		UserService,
		TokensService,
		PrismaService,
		EmailConfirmationService,
		MailService,
		PasswordRecoveryService,
	],
	exports: [AuthService],
})
export class AuthModule {}
