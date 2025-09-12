import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { EmailConfirmationDto } from '@/auth/dto/email-confirmation.dto';
import { EmailConfirmationService } from '@/auth/email-confirmation/email-confirmation.service';
import { ROUTS_PATH } from '@/constants/routes.constant';

@Controller(ROUTS_PATH.AUTH.ROOT)
export class EmailConfirmationController {
	constructor(private readonly emailConfirmationService: EmailConfirmationService) {}

	@Post(ROUTS_PATH.AUTH.EMAIL_CONFIRMATION)
	@HttpCode(HttpStatus.NO_CONTENT)
	async emailConfirmation(@Body() data: EmailConfirmationDto, @Res({ passthrough: true }) res: Response) {
		await this.emailConfirmationService.emailConfirmation(data, res);
	}

	@Post(ROUTS_PATH.AUTH.EMAIL_CONFIRMATION_RESEND)
	@HttpCode(HttpStatus.NO_CONTENT)
	async resendLinkEmailConfirmation(@Body() data: EmailConfirmationDto) {
		await this.emailConfirmationService.resendLinkEmailConfirmation(data);
	}
}
