import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Recaptcha } from '@nestlab/google-recaptcha';

import { ConfirmationResponseDto } from '@/auth/dto/confirmation-response.dto';
import {
	PasswordRecoveryEmailDto,
	PasswordRecoveryPasswordDto,
	PasswordRecoveryTokenDto,
} from '@/auth/dto/password-recovery.dto';
import { SentMailResponseDto } from '@/auth/dto/sent-mail-response.dto';
import { PasswordRecoveryService } from '@/auth/password-recovery/password-recovery.service';
import { ROUTS_PATH } from '@/constants/routes.constant';

@Controller(ROUTS_PATH.AUTH.ROOT)
export class PasswordRecoveryController {
	constructor(private readonly passwordRecoveryService: PasswordRecoveryService) {}

	@Recaptcha()
	@Post(ROUTS_PATH.AUTH.PASSWORD_RESET)
	@HttpCode(HttpStatus.OK)
	async sendPasswordRecoveryLink(@Body() data: PasswordRecoveryEmailDto): Promise<SentMailResponseDto> {
		return await this.passwordRecoveryService.sendPasswordRecoveryLink(data);
	}

	@Recaptcha()
	@Post(ROUTS_PATH.AUTH.PASSWORD_RECOVERY)
	@HttpCode(HttpStatus.OK)
	async passwordRecovery(@Body() data: PasswordRecoveryPasswordDto): Promise<ConfirmationResponseDto> {
		return await this.passwordRecoveryService.passwordRecovery(data);
	}

	@Post(ROUTS_PATH.AUTH.PASSWORD_RECOVERY_RESEND)
	@HttpCode(HttpStatus.OK)
	async resendPasswordRecovery(@Body() data: PasswordRecoveryTokenDto): Promise<SentMailResponseDto> {
		return await this.passwordRecoveryService.resendPasswordRecoveryLink(data);
	}
}
