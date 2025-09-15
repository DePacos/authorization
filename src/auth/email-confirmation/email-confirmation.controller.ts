import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { ConfirmationResponseDto } from '@/auth/dto/confirmation-response.dto';
import { EmailConfirmationDto } from '@/auth/dto/email-confirmation.dto';
import { SentMailResponseDto } from '@/auth/dto/sent-mail-response.dto';
import { EmailConfirmationService } from '@/auth/email-confirmation/email-confirmation.service';
import { ROUTS_PATH } from '@/constants/routes.constant';

@Controller(ROUTS_PATH.AUTH.ROOT)
export class EmailConfirmationController {
	constructor(private readonly emailConfirmationService: EmailConfirmationService) {}

	@Post(ROUTS_PATH.AUTH.EMAIL_CONFIRMATION)
	@HttpCode(HttpStatus.OK)
	async emailConfirmation(
		@Body() data: EmailConfirmationDto,
		@Res({ passthrough: true }) res: Response<ConfirmationResponseDto>,
	): Promise<ConfirmationResponseDto> {
		return await this.emailConfirmationService.emailConfirmation(data, res);
	}

	@Post(ROUTS_PATH.AUTH.EMAIL_CONFIRMATION_RESEND)
	@HttpCode(HttpStatus.OK)
	async resendLinkEmailConfirmation(@Body() data: EmailConfirmationDto): Promise<SentMailResponseDto> {
		return await this.emailConfirmationService.resendLinkEmailConfirmation(data);
	}
}
