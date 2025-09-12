import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Tokens } from '@prisma/__generated__';
import { Response } from 'express';

import { EmailConfirmationDto } from '@/auth/dto/email-confirmation.dto';
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

	public async sendLinkEmailConfirmation(userId: string, email: string) {
		const BASE_URL = this.configService.get<string>('APPLICATION_URL');
		const { verifier, verifierJti, verifierTtl } = this.tokenService.getVerifyToken();

		await this.tokenService.saveToken(userId, email, {
			token: verifier,
			tokenJti: verifierJti,
			tokenType: Tokens.VERIFICATION,
			tokenTtl: verifierTtl,
		});

		const link = `${BASE_URL + '/' + ROUTS_PATH.AUTH.ROOT + '/' + ROUTS_PATH.AUTH.EMAIL_CONFIRMATION}?token=${verifier}.${verifierJti}`;

		return await this.mailService.sendMailEmailConfirmation(email, EMAIL_SUBJECT.EMAIL_CONFIRMATION, link);
	}

	public async emailConfirmation(data: EmailConfirmationDto, res: Response) {
		const { foundToken } = await this.tokenService.verifyConfirmationToken(data.token, Tokens.VERIFICATION, true);
		await this.tokenService.removeToken(foundToken.jti);
		await this.userService.verifyUser(foundToken.userId);

		const { refreshToken, refreshJti, refreshTtl } = await this.tokenService.getRefreshTokens(foundToken.userId);
		await this.tokenService.saveToken(foundToken.userId, foundToken.email, {
			token: refreshToken,
			tokenJti: refreshJti,
			tokenType: Tokens.REFRESH,
			tokenTtl: refreshTtl,
		});

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: !IS_DEV_ENV,
			maxAge: refreshTtl,
			path: '/auth/update',
			sameSite: 'lax',
		});
	}

	public async resendLinkEmailConfirmation(data: EmailConfirmationDto) {
		const { foundToken } = await this.tokenService.verifyConfirmationToken(data.token, Tokens.VERIFICATION);
		await this.sendLinkEmailConfirmation(foundToken.userId, foundToken.email);
	}
}
