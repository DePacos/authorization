import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response: Response = context.getResponse();
		const request: Request = context.getRequest();

		if (exception instanceof HttpException) {
			const status = exception.getStatus();
			const body = exception.getResponse();

			return response.status(status).json(typeof body === 'object' ? body : { statusCode: status, message: body });
		}

		const status = HttpStatus.INTERNAL_SERVER_ERROR;
		const message = exception instanceof Error ? exception.message : 'Internal Server Error';

		return response.status(status).json({ statusCode: status, message, path: request.url });
	}
}
