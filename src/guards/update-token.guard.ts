import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

import { TokensService } from '@/auth/tokens/tokens.service';
import { UserService } from '@/user/user.service';

@Injectable()
export class UpdateTokenGuard implements CanActivate {
	public constructor(
		private readonly userService: UserService,
		private readonly tokenService: TokensService,
	) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request: Request = context.switchToHttp().getRequest();

		const refreshToken = request.cookies?.refreshToken as string | undefined;
		if (!refreshToken) throw new UnauthorizedException('Token invalid');

		const { foundTokenRow } = await this.tokenService.verifyRefreshToken(refreshToken);
		const user = await this.userService.getUserById(foundTokenRow.userId);
		if (!user) throw new NotFoundException('User not found');

		request.user = user;
		request.tokenId = foundTokenRow.id;

		return true;
	}
}
