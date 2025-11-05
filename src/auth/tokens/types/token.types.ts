import { Tokens } from '@prisma/__generated__';

export type SaveTokenData = {
	id: string;
	userId: string;
	email: string;
	token: string;
	tokenType: Tokens;
	tokenTtl: number;
};
