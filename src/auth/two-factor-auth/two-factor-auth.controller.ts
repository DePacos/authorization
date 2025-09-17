import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { Response } from 'express';

import { SentMailResponseDto } from '@/auth/dto/sent-mail-response.dto';
import { TwoFactorAuthDto } from '@/auth/dto/two-factor-auth.dto';
import { TwoFactorAuthService } from '@/auth/two-factor-auth/two-factor-auth.service';
import { ROUTS_PATH } from '@/constants/routes.constant';

@Controller(ROUTS_PATH.AUTH.ROOT)
export class TwoFactorAuthController {
	constructor(private readonly twoFactorAuthService: TwoFactorAuthService) {}

	@Recaptcha()
	@Post(ROUTS_PATH.AUTH.TWO_FACTOR_AUTH)
	@HttpCode(HttpStatus.OK)
	async twoFactorAuth(@Body() data: TwoFactorAuthDto, @Res({ passthrough: true }) res: Response) {
		await this.twoFactorAuthService.twoFactorAuth(data, res);
	}

	@Post(ROUTS_PATH.AUTH.TWO_FACTOR_AUTH_RESEND)
	@HttpCode(HttpStatus.OK)
	async resendMailTwoFactorAuth(@Body() data: TwoFactorAuthDto): Promise<SentMailResponseDto> {
		return await this.twoFactorAuthService.resendMailTwoFactorAuth(data);
	}
}
