import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { ProviderService } from '@/auth/provider';
import { PARAM, ROUTS_PATH } from '@/constants';
import { AuthProviderGuard } from '@/guards';

@Controller(ROUTS_PATH.AUTH.PROVIDER_CONNECT)
export class ProviderController {
	constructor(private readonly providerService: ProviderService) {}

	@UseGuards(AuthProviderGuard)
	@Get(ROUTS_PATH.AUTH.PROVIDER_CONNECT)
	connect(@Param(PARAM.PROVIDER) provider: string) {
		return this.providerService.generateServiceUrl(provider);
	}

	@UseGuards(AuthProviderGuard)
	@Get(ROUTS_PATH.AUTH.PROVIDER_CALLBACK)
	async callback(
		@Param(PARAM.PROVIDER) provider: string,
		@Query(PARAM.CODE) code?: string,
		@Query(PARAM.STATE) state?: string,
	) {
		return await this.providerService.serviceAuthentication(provider, code, state);
	}
}
