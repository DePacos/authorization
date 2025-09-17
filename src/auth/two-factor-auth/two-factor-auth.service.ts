import { Injectable, NotFoundException } from '@nestjs/common';
import { Tokens } from '@prisma/__generated__';
import { Response } from 'express';

import { SentMailResponseDto } from '@/auth/dto/sent-mail-response.dto';
import { TwoFactorAuthDto } from '@/auth/dto/two-factor-auth.dto';
import { TokensService } from '@/auth/tokens/tokens.service';
import { EMAIL_SUBJECT } from '@/constants/app.constant';
import { MailService } from '@/mail/mail.service';
import { UserService } from '@/user/user.service';
import { IS_DEV_ENV } from '@/utils/is-dev.utils';

@Injectable()
export class TwoFactorAuthService {
	constructor(
		private readonly userService: UserService,
		private readonly tokensService: TokensService,
		private readonly mailService: MailService,
	) {}

	public async sendMailTwoFactorAuth(userId: string, email: string, tokenJti: string): Promise<SentMailResponseDto> {
		const { twoFactorToken, twoFactorTtl } = this.tokensService.getTwoFactorToken();

		await this.tokensService.saveToken(userId, email, {
			token: twoFactorToken,
			tokenType: Tokens.TWO_FACTOR,
			tokenTtl: twoFactorTtl,
			tokenJti,
		});

		return await this.mailService.sendMailTwoFactorAuth(email, EMAIL_SUBJECT.TWO_FACTOR_AUTH, twoFactorToken);
	}

	public async resendMailTwoFactorAuth(data: TwoFactorAuthDto): Promise<SentMailResponseDto> {
		const { foundToken } = await this.tokensService.verifyToken(data.token, data.token, Tokens.TWO_FACTOR, true);
		const user = await this.userService.getUserById(foundToken.userId);
		if (!user) throw new NotFoundException('User not found');

		return await this.sendMailTwoFactorAuth(foundToken.userId, foundToken.email, foundToken.jti);
	}

	public async twoFactorAuth(data: TwoFactorAuthDto, res: Response) {
		const { foundToken } = await this.tokensService.verifyToken(String(data.code), data.token, Tokens.TWO_FACTOR, true);
		const { refreshToken, refreshJti, refreshTtl } = await this.tokensService.getRefreshTokens(foundToken.userId);

		await this.tokensService.saveToken(foundToken.userId, foundToken.email, {
			token: refreshToken,
			tokenType: Tokens.REFRESH,
			tokenTtl: refreshTtl,
			tokenJti: refreshJti,
		});

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: !IS_DEV_ENV,
			maxAge: refreshTtl,
			path: '/auth/update',
			sameSite: 'lax',
		});
	}
}
