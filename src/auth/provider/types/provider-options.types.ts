import { FactoryProvider, ModuleMetadata } from '@nestjs/common';

import { OAuthService } from '@/auth/provider/services';

export type ProviderOptions = {
	scopes: string[];
	client_id: string;
	client_secret: string;
};

export const ProviderOptionsSymbol = Symbol();

export type Options = {
	baseUrl: string;
	services: OAuthService[];
};

export type AsyncOptions = Pick<ModuleMetadata, 'imports'> & Pick<FactoryProvider<Options>, 'useFactory' | 'inject'>;
