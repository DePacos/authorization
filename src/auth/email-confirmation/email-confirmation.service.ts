import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Tokens } from '@prisma/__generated__';
import { Response } from 'express';

import { ConfirmationResponseDto, EmailConfirmationDto, SentMailResponseDto } from '@/auth/dto';
import { TokensService } from '@/auth/tokens';
import { EMAIL_SUBJECT, ROUTS_PATH } from '@/constants';
import { MailService } from '@/mail';
import { UserService } from '@/user';
import { IS_DEV_ENV } from '@/utils';

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
		if (foundTokenRow) await this.tokenService.removeToken(foundTokenRow.id);

		const { verifierToken, verifierTokenId, verifierTtl } = this.tokenService.getVerifyToken();

		await this.tokenService.saveToken({
			id: verifierTokenId,
			userId,
			email,
			token: verifierToken,
			tokenType: Tokens.VERIFICATION,
			tokenTtl: verifierTtl,
		});

		const link = `${BASE_URL + '/' + ROUTS_PATH.AUTH.ROOT + '/' + ROUTS_PATH.AUTH.EMAIL_CONFIRMATION}?token=${verifierToken}.${verifierTokenId}`;

		return await this.mailService.sendMailEmailConfirmation(email, EMAIL_SUBJECT.EMAIL_CONFIRMATION, link);
	}

	public async emailConfirmation(data: EmailConfirmationDto, res: Response): Promise<ConfirmationResponseDto> {
		const { foundTokenRow } = await this.tokenService.verifyConfirmationToken(data.token, true);
		await this.tokenService.removeToken(foundTokenRow.id);
		await this.userService.verifyUser(foundTokenRow.userId);

		const { refreshToken, refreshTokenId, refreshTtl } = await this.tokenService.getRefreshTokens(foundTokenRow.userId);

		await this.tokenService.saveToken({
			id: refreshTokenId,
			userId: foundTokenRow.userId,
			email: foundTokenRow.email,
			token: refreshToken,
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
