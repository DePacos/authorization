import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Tokens, User } from '@prisma/__generated__';
import * as argon2 from 'argon2';
import { Response } from 'express';

import { LoginDto } from '@/auth/dto/login.dto';
import { RegisterDto } from '@/auth/dto/register.dto';
import { EmailConfirmationService } from '@/auth/email-confirmation/email-confirmation.service';
import { TokensService } from '@/auth/tokens/tokens.service';
import { UserService } from '@/user/user.service';
import { IS_DEV_ENV } from '@/utils/is-dev.utils';

@Injectable()
export class AuthService {
	public constructor(
		private readonly userService: UserService,
		private readonly tokenService: TokensService,
		private readonly emailConfirmationService: EmailConfirmationService,
	) {}

	public async register(data: RegisterDto) {
		const { name, email, password } = data;
		const user = await this.userService.getUserByEmail(email);

		if (user) throw new ConflictException('User exists');

		const passwordHash = await argon2.hash(password);
		const newUser = await this.userService.createUser({ name, email, password: passwordHash });

		return await this.emailConfirmationService.sendLinkEmailConfirmation(newUser.id, newUser.email);
	}

	public async login(data: LoginDto, res: Response) {
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

		//todo two factor auth

		return await this.getAuthTokens(user, res);
	}

	public async update(user: User, res: Response) {
		return await this.getAuthTokens(user, res);
	}

	public async logout(user: User, res: Response) {
		const token = await this.tokenService.getTokenByUserIdAndType(user.id, 'REFRESH');
		if (!token) throw new NotFoundException('token not found');

		await this.tokenService.removeToken(token.jti);

		res.cookie('refreshToken', '', {
			httpOnly: true,
			secure: !IS_DEV_ENV,
			maxAge: 0,
			path: '/auth/update',
			sameSite: 'lax',
		});
	}

	private async getAuthTokens(user: User, res: Response) {
		const { accessToken } = await this.tokenService.getAccessToken(user.id);
		const { refreshToken, refreshJti, refreshTtl } = await this.tokenService.getRefreshTokens(user.id);

		await this.tokenService.saveToken(user.id, user.email, {
			token: refreshToken,
			tokenType: Tokens.REFRESH,
			tokenJti: refreshJti,
			tokenTtl: refreshTtl,
		});

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: !IS_DEV_ENV,
			maxAge: refreshTtl,
			path: '/auth/update',
			sameSite: 'lax',
		});

		return { accessToken };
	}
}
