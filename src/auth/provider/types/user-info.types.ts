import { AuthProvider } from '@prisma/__generated__';

export type UserInfo = {
	id: string;
	name: string;
	email: string;
	picture: string;
	accessToken?: string | null;
	refreshToken?: string;
	expiresAt?: number;
	provider: AuthProvider;
};
