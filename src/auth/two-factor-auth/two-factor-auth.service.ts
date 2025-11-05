import { Injectable } from '@nestjs/common';
import { Tokens } from '@prisma/__generated__';
import { Response } from 'express';

import { SentMailResponseDto, TwoFactorAuthDto } from '@/auth/dto';
import { TokensService } from '@/auth/tokens';
import { EMAIL_SUBJECT, REFRESH_TOKEN, ROUTS_PATH } from '@/constants';
import { MailService } from '@/mail';
import { IS_DEV_ENV } from '@/utils';

@Injectable()
export class TwoFactorAuthService {
	constructor(
		private readonly tokensService: TokensService,
		private readonly mailService: MailService,
	) {}

	public async sendMailTwoFactorAuth(userId: string, email: string, tokenId: string): Promise<SentMailResponseDto> {
		const { twoFactorToken, twoFactorTtl } = this.tokensService.getTwoFactorToken();

		await this.tokensService.saveToken({
			id: tokenId,
			userId,
			email,
			token: twoFactorToken,
			tokenType: Tokens.TWO_FACTOR,
			tokenTtl: twoFactorTtl,
		});

		return await this.mailService.sendMailTwoFactorAuth(email, EMAIL_SUBJECT.TWO_FACTOR_AUTH, twoFactorToken);
	}

	public async twoFactorAuth(data: TwoFactorAuthDto, res: Response) {
		const { code, tokenId } = data;
		const { foundTokenRow } = await this.tokensService.verifyToken(code, tokenId, true);

		await this.tokensService.removeToken(foundTokenRow.id);

		const { refreshToken, refreshTokenId, refreshTtl } = await this.tokensService.getRefreshTokens(
			foundTokenRow.userId,
		);

		await this.tokensService.saveToken({
			id: refreshTokenId,
			userId: foundTokenRow.userId,
			email: foundTokenRow.email,
			token: refreshToken,
			tokenType: Tokens.REFRESH,
			tokenTtl: refreshTtl,
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
