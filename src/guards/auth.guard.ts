import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

import { UserService } from '@/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
	public constructor(private readonly userService: UserService) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request: Request = context.switchToHttp().getRequest();

		if (!request.session.userId) {
			throw new UnauthorizedException('User is not authorized');
		}

		const user = await this.userService.findById(request.session.userId);
		if (!user) throw new UnauthorizedException('User not found');

		request.user = user;

		return true;
	}
}
