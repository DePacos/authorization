import { AuthProvider } from '@prisma/__generated__';

export type Provider = {
	name: AuthProvider;
	authorize_url: string;
	access_url: string;
	profile_url: string;
	scopes: string[];
	client_id: string;
	client_secret: string;
};
