import { Tokens } from '@prisma/__generated__';

export type SaveTokenData = {
	userId: string;
	email: string;
	token: string;
	tokenType: Tokens;
	tokenUuid: string;
	tokenTtl: number;
};
