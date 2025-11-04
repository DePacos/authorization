import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { ConfirmationResponseDto, EmailConfirmationDto, SentMailResponseDto } from '@/auth/dto';
import { EmailConfirmationService } from '@/auth/email-confirmation/email-confirmation.service';
import { ROUTS_PATH } from '@/constants';

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
