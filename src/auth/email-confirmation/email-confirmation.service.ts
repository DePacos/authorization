import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Tokens } from '@prisma/__generated__';
import { Response } from 'express';

import { ConfirmationResponseDto } from '@/auth/dto/confirmation-response.dto';
import { EmailConfirmationDto } from '@/auth/dto/email-confirmation.dto';
import { SentMailResponseDto } from '@/auth/dto/sent-mail-response.dto';
import { TokensService } from '@/auth/tokens/tokens.service';
import { EMAIL_SUBJECT } from '@/constants/app.constant';
import { ROUTS_PATH } from '@/constants/routes.constant';
import { MailService } from '@/mail/mail.service';
import { UserService } from '@/user/user.service';
import { IS_DEV_ENV } from '@/utils/is-dev.utils';

@Injectable()
export class EmailConfirmationService {
	constructor(
		private readonly tokenService: TokensService,
		private readonly configService: ConfigService,
		private readonly userService: UserService,
		private readonly mailService: MailService,
	) {}

	public async sendLinkEmailConfirmation(userId: string, email: string): Promise<SentMailResponseDto> {
		const BASE_URL = this.configService.get<string>('APPLICATION_URL');

		const foundTokenRow = await this.tokenService.getTokenByUserIdTokenType(userId, 'VERIFICATION');
		if (foundTokenRow) await this.tokenService.removeToken(foundTokenRow.tokenUuid);

		const { verifierToken, verifierTokenUuid, verifierTtl } = this.tokenService.getVerifyToken();

		await this.tokenService.saveToken({
			userId,
			email,
			token: verifierToken,
			tokenUuid: verifierTokenUuid,
			tokenType: Tokens.VERIFICATION,
			tokenTtl: verifierTtl,
		});

		const link = `${BASE_URL + '/' + ROUTS_PATH.AUTH.ROOT + '/' + ROUTS_PATH.AUTH.EMAIL_CONFIRMATION}?token=${verifierToken}.${verifierTokenUuid}`;

		return await this.mailService.sendMailEmailConfirmation(email, EMAIL_SUBJECT.EMAIL_CONFIRMATION, link);
	}

	public async emailConfirmation(data: EmailConfirmationDto, res: Response): Promise<ConfirmationResponseDto> {
		const { foundTokenRow } = await this.tokenService.verifyConfirmationToken(data.token, true);
		await this.tokenService.removeToken(foundTokenRow.tokenUuid);
		await this.userService.verifyUser(foundTokenRow.userId);

		const { refreshToken, refreshTokenUuid, refreshTtl } = await this.tokenService.getRefreshTokens(
			foundTokenRow.userId,
		);

		await this.tokenService.saveToken({
			userId: foundTokenRow.userId,
			email: foundTokenRow.email,
			token: refreshToken,
			tokenUuid: refreshTokenUuid,
			tokenType: Tokens.REFRESH,
			tokenTtl: refreshTtl,
		});

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: !IS_DEV_ENV,
			maxAge: refreshTtl,
			path: '/' + ROUTS_PATH.AUTH.ROOT + '/' + ROUTS_PATH.AUTH.UPDATE_TOKEN,
			sameSite: 'lax',
		});

		return { success: true };
	}

	public async resendLinkEmailConfirmation(data: EmailConfirmationDto): Promise<SentMailResponseDto> {
		const { foundTokenRow } = await this.tokenService.verifyConfirmationToken(data.token);
		return await this.sendLinkEmailConfirmation(foundTokenRow.userId, foundTokenRow.email);
	}
}
