import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { ProviderService } from '@/auth/provider/provider.service';

@Injectable()
export class AuthProviderGuard implements CanActivate {
	public constructor(private readonly providerService: ProviderService) {}

	public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request: Request = context.switchToHttp().getRequest();
		const provider = request.params.provider;

		const providerInstance = this.providerService.findByService(provider);

		if (!providerInstance) throw new NotFoundException('Provider not found');

		return true;
	}
}
