import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/__generated__';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Request } from 'express';

export const Authorized = createParamDecorator(
	<T extends object>(DtoClass: ClassConstructor<T> | undefined, context: ExecutionContext): T | User => {
		const request: Request = context.switchToHttp().getRequest();

		if (!DtoClass) return request.user as User;

		return plainToInstance(DtoClass, request.user, {
			excludeExtraneousValues: true,
		});
	},
);
