import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';

import { AuthController, AuthService } from '@/auth';
import { EmailConfirmationModule, EmailConfirmationService } from '@/auth/email-confirmation';
import { PasswordRecoveryModule, PasswordRecoveryService } from '@/auth/password-recovery';
import { ProviderModule } from '@/auth/provider';
import { TokensService } from '@/auth/tokens';
import { TwoFactorAuthModule, TwoFactorAuthService } from '@/auth/two-factor-auth';
import { getProviderConfig, getRecaptchaConfig } from '@/configs';
import { MailService } from '@/mail';
import { PrismaService } from '@/prisma';
import { UserService } from '@/user';

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
		GoogleRecaptchaModule,
		EmailConfirmationModule,
		PasswordRecoveryModule,
		TwoFactorAuthModule,
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
		TwoFactorAuthService,
	],
	exports: [AuthService],
})
export class AuthModule {}
