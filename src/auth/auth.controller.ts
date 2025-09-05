import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { User } from '@prisma/__generated__';
import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';

import { AuthService } from '@/auth/auth.service';
import { LoginDto } from '@/auth/dto/login.dto';
import { MeResponseDto } from '@/auth/dto/me-response.dto';
import { RegisterDto } from '@/auth/dto/register.dto';
import { ProviderService } from '@/auth/provider/provider.service';
import { ROUTS_PATH } from '@/constants/routes.constant';
import { Authorization } from '@/decorators/auth.decorator';
import { Authorized } from '@/decorators/authorized.decorator';
import { AuthProviderGuard } from '@/guards/auth-provider.guard';

@Controller(ROUTS_PATH.AUTH.ROOT)
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly providerService: ProviderService,
	) {}

	@Recaptcha()
	@Post(ROUTS_PATH.AUTH.REGISTER)
	@HttpCode(HttpStatus.OK)
	async register(@Body() data: RegisterDto) {
		await this.authService.register(data);
	}

	@Recaptcha()
	@Post(ROUTS_PATH.AUTH.LOGIN)
	@HttpCode(HttpStatus.OK)
	async login(@Body() data: LoginDto, @Res({ passthrough: true }) res: Response) {
		return await this.authService.login(data, res);
	}

	@Authorization()
	@Post(ROUTS_PATH.AUTH.LOGOUT)
	@HttpCode(HttpStatus.NO_CONTENT)
	async logout(@Req() req: Request) {
		await this.authService.logout(req);
	}

	@Authorization()
	@Get(ROUTS_PATH.AUTH.ME)
	@HttpCode(HttpStatus.OK)
	me(@Authorized() user: User) {
		return plainToInstance(MeResponseDto, user, {
			excludeExtraneousValues: true,
		});
	}

	@Post(ROUTS_PATH.AUTH.UPDATE)
	@HttpCode(HttpStatus.OK)
	async update(@Authorized() user: User, @Res({ passthrough: true }) res: Response) {
		await this.authService.update(user, res);
	}

	@UseGuards(AuthProviderGuard)
	@Get(ROUTS_PATH.AUTH.PROVIDER_CONNECT)
	connect(@Param('provider') provider: string) {
		return this.providerService.generateServiceUrl(provider);
	}

	@UseGuards(AuthProviderGuard)
	@Get(ROUTS_PATH.AUTH.PROVIDER_CALLBACK)
	async callback(
		@Req() req: Request,
		@Param('provider') provider: string,
		@Query('code') code?: string,
		@Query('state') state?: string,
	) {
		return await this.providerService.serviceAuthentication(req, provider, code, state);
	}
}
