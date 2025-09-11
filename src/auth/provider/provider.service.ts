import { BadRequestException, Inject, OnModuleInit } from '@nestjs/common';
import { Tokens } from '@prisma/__generated__';

import { Options, ProviderOptionsSymbol } from '@/auth/provider/types/provider-options.types';
import { TokensService } from '@/auth/tokens/tokens.service';
import { SaveTokenData } from '@/auth/tokens/types/token.types';
import { UserService } from '@/user/user.service';

export class ProviderService implements OnModuleInit {
	public constructor(
		@Inject(ProviderOptionsSymbol)
		private readonly options: Options,
		private readonly tokenService: TokensService,
		private readonly userService: UserService,
	) {}

	public onModuleInit() {
		for (const provider of this.options.services) {
			provider.baseUrl = this.options.baseUrl;
			provider.setTokenService = this.tokenService;
		}
	}

	public findByService(service: string) {
		const providerInstance = this.options.services.find((s) => s.name === service.toUpperCase()) ?? null;
		if (!providerInstance) throw new BadRequestException('invalid provider service');

		return providerInstance;
	}

	public async generateServiceUrl(service: string) {
		const providerInstance = this.findByService(service);

		return await providerInstance.getAuthUrl();
	}

	public async serviceAuthentication(service: string, code?: string, state?: string) {
		if (!code || !state) throw new BadRequestException('invalid url authorization');

		const providerInstance = this.findByService(service);
		const { verifier } = await providerInstance.parseState(state);
		const providerProfile = await providerInstance?.getUserByCode(code, verifier);

		const foundUser = await this.userService.getUserByEmail(providerProfile.email);
		const account = foundUser?.account.find((acc) => acc.provider === providerInstance.name);

		if (foundUser && !account) await this.userService.createAccountByProvider(foundUser.id, providerInstance.name);
		const user = foundUser ? foundUser : await this.userService.createUserByProvider(providerProfile);

		const { accessToken } = await this.tokenService.getAccessToken(user.id);
		const { refreshToken, refreshJti, refreshTtl } = await this.tokenService.getRefreshTokens(user.id);

		const tokenData: SaveTokenData = {
			token: refreshToken,
			tokenType: Tokens.REFRESH,
			tokenJti: refreshJti,
			tokenTtl: refreshTtl,
		};

		await this.tokenService.saveToken(user.id, user.email, tokenData);

		return { accessToken };
	}
}
