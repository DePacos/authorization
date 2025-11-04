import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { User } from '@prisma/__generated__';
import { Response } from 'express';

import { AuthService } from '@/auth/auth.service';
import {
	LoginDto,
	LoginResponseDto,
	MeResponseDto,
	RegisterDto,
	SentMailResponseDto,
	UpdateResponseDto,
} from '@/auth/dto';
import { ROUTS_PATH } from '@/constants';
import { Authorization, Authorized, Logout, UpdateToken } from '@/decorators';
import { UpdateTokenGuard } from '@/guards';

@Controller(ROUTS_PATH.AUTH.ROOT)
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Recaptcha()
	@Post(ROUTS_PATH.AUTH.REGISTER)
	@HttpCode(HttpStatus.OK)
	async register(@Body() data: RegisterDto): Promise<SentMailResponseDto> {
		return await this.authService.register(data);
	}

	@Recaptcha()
	@Post(ROUTS_PATH.AUTH.LOGIN)
	@HttpCode(HttpStatus.OK)
	async login(@Body() data: LoginDto, @Res({ passthrough: true }) res: Response): Promise<LoginResponseDto> {
		return await this.authService.login(data, res);
	}

	@Authorization()
	@Post(ROUTS_PATH.AUTH.LOGOUT)
	@HttpCode(HttpStatus.NO_CONTENT)
	async logout(@Logout() tokenUuid: string, @Res({ passthrough: true }) res: Response) {
		await this.authService.logout(tokenUuid, res);
	}

	@Authorization()
	@Get(ROUTS_PATH.AUTH.ME)
	@HttpCode(HttpStatus.OK)
	me(@Authorized(MeResponseDto) user: User) {
		return user;
	}

	@UseGuards(UpdateTokenGuard)
	@Post(ROUTS_PATH.AUTH.UPDATE_TOKEN)
	@HttpCode(HttpStatus.OK)
	async updateAccessToken(@UpdateToken() data: { user: User; tokenUuid: string }): Promise<UpdateResponseDto> {
		return await this.authService.updateAccessToken(data.user.id, data.tokenUuid);
	}
}
