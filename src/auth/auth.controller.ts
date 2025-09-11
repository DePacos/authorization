import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { User } from '@prisma/__generated__';
import { Response } from 'express';

import { AuthService } from '@/auth/auth.service';
import { LoginDto } from '@/auth/dto/login.dto';
import { MeResponseDto } from '@/auth/dto/me-response.dto';
import { RegisterDto } from '@/auth/dto/register.dto';
import { ROUTS_PATH } from '@/constants/routes.constant';
import { Authorization } from '@/decorators/auth.decorator';
import { Authorized } from '@/decorators/authorized.decorator';
import { AuthUpdateGuard } from '@/guards/auth-update.guard';

@Controller(ROUTS_PATH.AUTH.ROOT)
export class AuthController {
	constructor(private readonly authService: AuthService) {}

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
	async logout(@Authorized() user: User, @Res({ passthrough: true }) res: Response) {
		await this.authService.logout(user, res);
	}

	@Authorization()
	@Get(ROUTS_PATH.AUTH.ME)
	@HttpCode(HttpStatus.OK)
	me(@Authorized(MeResponseDto) user: User) {
		return user;
	}

	@UseGuards(AuthUpdateGuard)
	@Post(ROUTS_PATH.AUTH.UPDATE)
	@HttpCode(HttpStatus.OK)
	async update(@Authorized() user: User, @Res({ passthrough: true }) res: Response) {
		return await this.authService.update(user, res);
	}
}
