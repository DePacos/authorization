import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';

import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { EmailConfirmationModule } from '@/auth/email-confirmation/email-confirmation.module';
import { EmailConfirmationService } from '@/auth/email-confirmation/email-confirmation.service';
import { PasswordRecoveryModule } from '@/auth/password-recovery/password-recovery.module';
import { PasswordRecoveryService } from '@/auth/password-recovery/password-recovery.service';
import { ProviderModule } from '@/auth/provider/provider.module';
import { TokensService } from '@/auth/tokens/tokens.service';
import { TwoFactorAuthModule } from '@/auth/two-factor-auth/two-factor-auth.module';
import { TwoFactorAuthService } from '@/auth/two-factor-auth/two-factor-auth.service';
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
