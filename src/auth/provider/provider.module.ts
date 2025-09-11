import { DynamicModule, Module } from '@nestjs/common';

import { AuthService } from '@/auth/auth.service';
import { EmailConfirmationService } from '@/auth/email-confirmation/email-confirmation.service';
import { ProviderController } from '@/auth/provider/provider.controller';
import { ProviderService } from '@/auth/provider/provider.service';
import { AsyncOptions, Options, ProviderOptionsSymbol } from '@/auth/provider/types/provider-options.types';
import { TokensService } from '@/auth/tokens/tokens.service';
import { MailService } from '@/mail/mail.service';
import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/user/user.service';

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
				MailService,
			],
			exports: [ProviderService],
		};
	}
}
