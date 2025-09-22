import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Tokens, User } from '@prisma/__generated__';
import * as argon2 from 'argon2';
import { Response } from 'express';
import { randomUUID } from 'node:crypto';

import { LoginResponseDto } from '@/auth/dto/login-response.dto';
import { LoginDto } from '@/auth/dto/login.dto';
import { RegisterDto } from '@/auth/dto/register.dto';
import { SentMailResponseDto } from '@/auth/dto/sent-mail-response.dto';
import { UpdateResponseDto } from '@/auth/dto/update-response.dto';
import { EmailConfirmationService } from '@/auth/email-confirmation/email-confirmation.service';
import { TokensService } from '@/auth/tokens/tokens.service';
import { TwoFactorAuthService } from '@/auth/two-factor-auth/two-factor-auth.service';
import { REFRESH_TOKEN } from '@/constants/app.constant';
import { ROUTS_PATH } from '@/constants/routes.constant';
import { UserService } from '@/user/user.service';
import { IS_DEV_ENV } from '@/utils/is-dev.utils';

@Injectable()
export class AuthService {
	public constructor(
		private readonly userService: UserService,
		private readonly tokenService: TokensService,
		private readonly emailConfirmationService: EmailConfirmationService,
		private readonly twoFactorAuthService: TwoFactorAuthService,
	) {}

	public async register(data: RegisterDto): Promise<SentMailResponseDto> {
		const { name, email, password } = data;
		const user = await this.userService.getUserByEmail(email);
		if (user) throw new ConflictException('User exists');

		const passwordHash = await argon2.hash(password);
		const newUser = await this.userService.createUser({ name, email, password: passwordHash });

		return await this.emailConfirmationService.sendLinkEmailConfirmation(newUser.id, newUser.email);
	}

	public async login(data: LoginDto, res: Response): Promise<LoginResponseDto> {
		const { email, password } = data;
		const user = await this.userService.getUserByEmail(email);

		if (!user) throw new NotFoundException('User not exists');
		if (user.password && !(await argon2.verify(user.password, password)))
			throw new ConflictException('Invalid email or password');

		if (!user.isVerified) {
			await this.emailConfirmationService.sendLinkEmailConfirmation(user.id, user.email);
			throw new UnauthorizedException(
				'Your mail has not been confirmed, and a link has been sent to confirm your mail.',
			);
		}

		if (user.isTwoFactorEnable) {
			const tokenUuid = randomUUID();
			const { sentMessage } = await this.twoFactorAuthService.sendMailTwoFactorAuth(user.id, user.email, tokenUuid);

			return { sentMessage, tokenUuid };
		}

		return await this.getAuthTokens(user, res);
	}

	public async logout(tokenUuid: string, res: Response) {
		await this.tokenService.removeToken(tokenUuid);

		res.cookie(REFRESH_TOKEN, '', {
			httpOnly: true,
			secure: !IS_DEV_ENV,
			maxAge: 0,
			path: '/' + ROUTS_PATH.AUTH.ROOT + '/' + ROUTS_PATH.AUTH.UPDATE_TOKEN,
			sameSite: 'lax',
		});
	}

	public async updateAccessToken(userId: string, tokenUuid: string): Promise<UpdateResponseDto> {
		return this.tokenService.getAccessToken(userId, tokenUuid);
	}

	public async getAuthTokens(user: User, res: Response) {
		const { refreshToken, refreshTokenUuid, refreshTtl } = await this.tokenService.getRefreshTokens(user.id);
		const { accessToken } = await this.tokenService.getAccessToken(user.id, refreshTokenUuid);

		const foundTokenRow = await this.tokenService.getTokenByUserIdTokenType(user.id, 'REFRESH');
		if (foundTokenRow) await this.tokenService.removeToken(foundTokenRow.tokenUuid);

		await this.tokenService.saveToken({
			userId: user.id,
			email: user.email,
			token: refreshToken,
			tokenType: Tokens.REFRESH,
			tokenUuid: refreshTokenUuid,
			tokenTtl: refreshTtl,
		});

		res.cookie(REFRESH_TOKEN, refreshToken, {
			httpOnly: true,
			secure: !IS_DEV_ENV,
			maxAge: refreshTtl,
			path: '/' + ROUTS_PATH.AUTH.ROOT + '/' + ROUTS_PATH.AUTH.UPDATE_TOKEN,
			sameSite: 'lax',
		});

		return { accessToken };
	}
}
