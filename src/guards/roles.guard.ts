import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { $Enums } from '@prisma/__generated__';
import { Request } from 'express';

import { ROLES_KEY } from '@/constants/app.constant';

import UserRole = $Enums.UserRole;

@Injectable()
export class RolesGuard implements CanActivate {
	public constructor(private readonly reflector: Reflector) {}

	public canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

		if (!roles) return true;

		const request: Request = context.switchToHttp().getRequest();

		if (request.user && !roles.includes(request.user.role)) {
			throw new ForbiddenException('Access denied');
		}

		return true;
	}
}
