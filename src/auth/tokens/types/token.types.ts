import { Tokens } from '@prisma/__generated__';

export type SaveTokenData = {
	token: string;
	tokenType: Tokens;
	tokenJti: string;
	tokenTtl: number;
};
