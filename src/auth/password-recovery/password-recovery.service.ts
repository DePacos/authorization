import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Tokens } from '@prisma/__generated__';

import { ConfirmationResponseDto } from '@/auth/dto/confirmation-response.dto';
import {
	PasswordRecoveryEmailDto,
	PasswordRecoveryPasswordDto,
	PasswordRecoveryTokenDto,
} from '@/auth/dto/password-recovery.dto';
import { SentMailResponseDto } from '@/auth/dto/sent-mail-response.dto';
import { TokensService } from '@/auth/tokens/tokens.service';
import { EMAIL_SUBJECT } from '@/constants/app.constant';
import { ROUTS_PATH } from '@/constants/routes.constant';
import { MailService } from '@/mail/mail.service';
import { UserService } from '@/user/user.service';

@Injectable()
export class PasswordRecoveryService {
	constructor(
		private readonly configService: ConfigService,
		private readonly tokenService: TokensService,
		private readonly userService: UserService,
		private readonly mailService: MailService,
	) {}

	public async sendPasswordRecoveryLink(data: PasswordRecoveryEmailDto): Promise<SentMailResponseDto> {
		const user = await this.userService.getUserByEmail(data.email);
		if (!user) throw new NotFoundException('User not found');

		const BASE_URL = this.configService.get<string>('APPLICATION_URL');
		const { verifierToken, verifierJti, verifierTtl } = this.tokenService.getVerifyToken();

		await this.tokenService.saveToken(user.id, user.email, {
			token: verifierToken,
			tokenJti: verifierJti,
			tokenType: Tokens.PASSWORD_RESET,
			tokenTtl: verifierTtl,
		});

		const link = `${BASE_URL + '/' + ROUTS_PATH.AUTH.ROOT + '/' + ROUTS_PATH.AUTH.PASSWORD_RECOVERY}?token=${verifierToken}.${verifierJti}`;

		return await this.mailService.sendMailPasswordRecovery(user.email, EMAIL_SUBJECT.PASSWORD_RECOVERY, link);
	}

	public async passwordRecovery(data: PasswordRecoveryPasswordDto): Promise<ConfirmationResponseDto> {
		const { foundToken } = await this.tokenService.verifyConfirmationToken(data.token, Tokens.PASSWORD_RESET, true);

		await this.tokenService.removeToken(foundToken.jti);
		await this.userService.changePassword(foundToken.userId, data.password);

		return { success: true };
	}

	public async resendPasswordRecoveryLink(data: PasswordRecoveryTokenDto): Promise<SentMailResponseDto> {
		const { foundToken } = await this.tokenService.verifyConfirmationToken(data.token, Tokens.PASSWORD_RESET);

		return await this.sendPasswordRecoveryLink({ email: foundToken.email });
	}
}
