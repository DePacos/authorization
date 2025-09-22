import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

import { TokensService } from '@/auth/tokens/tokens.service';
import { UserService } from '@/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
	public constructor(
		private readonly userService: UserService,
		private readonly tokenService: TokensService,
	) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request: Request = context.switchToHttp().getRequest();

		const accessToken = request.headers.authorization?.startsWith('Bearer ') && request.headers.authorization.slice(7);
		if (!accessToken) throw new UnauthorizedException('Token invalid');

		const { userId, refreshTokenUuid } = await this.tokenService.verifyAccessToken(accessToken);
		const user = await this.userService.getUserById(userId);
		if (!user) throw new NotFoundException('User not found');

		request.user = user;
		request.tokenUuid = refreshTokenUuid;

		return true;
	}
}
