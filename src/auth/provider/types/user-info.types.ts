import { AuthProvider } from '@prisma/__generated__';

export type UserInfo = {
	id: string;
	name: string;
	email: string;
	picture: string;
	access_token?: string | null;
	refresh_token?: string;
	expires_at?: number;
	provider: AuthProvider;
};
