import { AuthProvider } from '@prisma/__generated__';

export type Provider = {
	name: AuthProvider;
	authorizeUrl: string;
	accessUrl: string;
	profileUrl: string;
	scopes: string[];
	clientId: string;
	clientSecret: string;
};
