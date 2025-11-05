import { User } from '@prisma/__generated__';
import 'express';
import 'express-session';

declare module 'express-session' {
	interface SessionData {
		userId: string;
	}
}

declare module 'express' {
	interface Request {
		user?: User;
		tokenId?: string;
	}
}
