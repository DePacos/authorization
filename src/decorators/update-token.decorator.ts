import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const UpdateToken = createParamDecorator((_: unknown, context: ExecutionContext) => {
	const request: Request = context.switchToHttp().getRequest();

	return {
		user: request.user,
		tokenId: request.tokenId,
	};
});
