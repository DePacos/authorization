import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
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

		const token = request.headers.authorization?.startsWith('Bearer ') && request.headers.authorization.slice(7);
		if (!token) throw new BadRequestException('token not found');

		const { userId } = await this.tokenService.verifyAccessToken(token);
		const user = await this.userService.findById(userId as string);
		if (!user) throw new UnauthorizedException('user not found');

		request.user = user;

		return true;
	}
}
