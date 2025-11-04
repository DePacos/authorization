import { DynamicModule, Module } from '@nestjs/common';

import { AuthService } from '@/auth';
import { EmailConfirmationService } from '@/auth/email-confirmation';
import { ProviderController, ProviderService } from '@/auth/provider';
import { AsyncOptions, Options, ProviderOptionsSymbol } from '@/auth/provider/types';
import { TokensService } from '@/auth/tokens';
import { TwoFactorAuthService } from '@/auth/two-factor-auth';
import { MailService } from '@/mail';
import { PrismaService } from '@/prisma';
import { UserService } from '@/user';

@Module({})
export class ProviderModule {
	public static register(options: Options): DynamicModule {
		return {
			module: ProviderModule,
			providers: [
				{
					useValue: options.services,
					provide: ProviderOptionsSymbol,
				},
				ProviderService,
			],
			controllers: [ProviderController],
			exports: [ProviderService],
		};
	}

	public static registerAsync(options: AsyncOptions): DynamicModule {
		return {
			module: ProviderModule,
			imports: options.imports,
			controllers: [ProviderController],
			providers: [
				{
					useFactory: options.useFactory,
					provide: ProviderOptionsSymbol,
					inject: options.inject,
				},
				ProviderService,
				UserService,
				PrismaService,
				AuthService,
				TokensService,
				EmailConfirmationService,
				TwoFactorAuthService,
				MailService,
			],
			exports: [ProviderService],
		};
	}
}
