import { AuthProvider } from '@prisma/__generated__';

export const ROLES_KEY = 'roles';
export const REFRESH_TOKEN = 'refreshToken';

export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/;

export const ENCRYPTION_ALG = {
	DIR: 'dir',
	A256GCM: 'A256GCM',
	SHA256: 'sha256',
	S256: 'S256',
	HS256: 'HS256',
	BASE64URL: 'base64url' as BufferEncoding,
	LENGTH64: 64,
} as const;

export const GOOGLE_PROVIDER = {
	name: 'GOOGLE' as AuthProvider,
	authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
	accessUrl: 'https://oauth2.googleapis.com/token',
	profileUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
} as const;

export const YANDEX_PROVIDER = {
	name: 'YANDEX' as AuthProvider,
	authorizeUrl: 'https://oauth.yandex.ru/authorize',
	accessUrl: 'https://oauth.yandex.ru/token',
	profileUrl: 'https://login.yandex.ru/info?format=json',
} as const;

export const EMAIL_SUBJECT = {
	EMAIL_CONFIRMATION: 'Email confirmation',
	PASSWORD_RECOVERY: 'Password recovery',
	TWO_FACTOR_AUTH: 'Two factor authorization',
};
