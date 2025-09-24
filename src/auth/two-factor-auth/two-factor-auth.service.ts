import { Injectable } from '@nestjs/common';
import { Tokens } from '@prisma/__generated__';
import { Response } from 'express';

import { SentMailResponseDto } from '@/auth/dto/sent-mail-response.dto';
import { TwoFactorAuthDto } from '@/auth/dto/two-factor-auth.dto';
import { TokensService } from '@/auth/tokens/tokens.service';
import { EMAIL_SUBJECT, REFRESH_TOKEN } from '@/constants/app.constant';
import { ROUTS_PATH } from '@/constants/routes.constant';
import { MailService } from '@/mail/mail.service';
import { IS_DEV_ENV } from '@/utils/is-dev.utils';

@Injectable()
export class TwoFactorAuthService {
	constructor(
		private readonly tokensService: TokensService,
		private readonly mailService: MailService,
	) {}

	public async sendMailTwoFactorAuth(userId: string, email: string, tokenUuid: string): Promise<SentMailResponseDto> {
		const { twoFactorToken, twoFactorTtl } = this.tokensService.getTwoFactorToken();

		await this.tokensService.saveToken({
			userId,
			email,
			token: twoFactorToken,
			tokenType: Tokens.TWO_FACTOR,
			tokenTtl: twoFactorTtl,
			tokenUuid,
		});

		return await this.mailService.sendMailTwoFactorAuth(email, EMAIL_SUBJECT.TWO_FACTOR_AUTH, twoFactorToken);
	}

	public async twoFactorAuth(data: TwoFactorAuthDto, res: Response) {
		const { foundTokenRow } = await this.tokensService.verifyToken(data.token, data.tokenUuid, true);

		const foundRefreshTokenRow = await this.tokensService.getTokenByUserIdTokenType(foundTokenRow.userId, 'REFRESH');
		if (foundRefreshTokenRow) await this.tokensService.removeToken(foundTokenRow.tokenUuid);

		const { refreshToken, refreshTokenUuid, refreshTtl } = await this.tokensService.getRefreshTokens(
			foundTokenRow.userId,
		);

		await this.tokensService.saveToken({
			userId: foundTokenRow.userId,
			email: foundTokenRow.email,
			token: refreshToken,
			tokenType: Tokens.REFRESH,
			tokenTtl: refreshTtl,
			tokenUuid: refreshTokenUuid,
		});

		res.cookie(REFRESH_TOKEN, refreshToken, {
			httpOnly: true,
			secure: !IS_DEV_ENV,
			maxAge: refreshTtl,
			path: '/' + ROUTS_PATH.AUTH.ROOT + '/' + ROUTS_PATH.AUTH.UPDATE_TOKEN,
			sameSite: 'lax',
		});
	}
}
