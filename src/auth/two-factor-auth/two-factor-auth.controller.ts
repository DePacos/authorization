import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { Response } from 'express';

import { TwoFactorAuthDto } from '@/auth/dto';
import { TwoFactorAuthService } from '@/auth/two-factor-auth/two-factor-auth.service';
import { ROUTS_PATH } from '@/constants';

@Controller(ROUTS_PATH.AUTH.ROOT)
export class TwoFactorAuthController {
	constructor(private readonly twoFactorAuthService: TwoFactorAuthService) {}

	@Recaptcha()
	@Post(ROUTS_PATH.AUTH.TWO_FACTOR_AUTH)
	@HttpCode(HttpStatus.OK)
	async twoFactorAuth(@Body() data: TwoFactorAuthDto, @Res({ passthrough: true }) res: Response) {
		await this.twoFactorAuthService.twoFactorAuth(data, res);
	}
}
