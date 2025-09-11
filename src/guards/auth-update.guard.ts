import { BadRequestException, CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';

import { TokensService } from '@/auth/tokens/tokens.service';
import { UserService } from '@/user/user.service';

@Injectable()
export class AuthUpdateGuard implements CanActivate {
	public constructor(
		private readonly userService: UserService,
		private readonly tokenService: TokensService,
	) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request: Request = context.switchToHttp().getRequest();

		const token = request.cookies?.refreshToken as string | undefined;
		if (!token) throw new BadRequestException('token invalid');

		const { foundToken } = await this.tokenService.verifyRefreshToken(token);
		const user = await this.userService.getUserById(foundToken.userId);
		if (!user) throw new NotFoundException('user not found');

		request.user = user;

		return true;
	}
}
