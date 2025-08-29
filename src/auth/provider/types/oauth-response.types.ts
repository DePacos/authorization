export type OAuthResponse = {
	// google
	name: string;
	email: string;
	email_verified?: string;
	family_name?: string;
	given_name?: string;
	picture: string;
	address_token?: string;
	refresh_token?: string;
	locale?: string;
	aud?: string;
	azp?: string;
	exp?: string;
	hd?: string;
	iat?: number;
	iss?: string;
	jti?: string;
	nbf?: number;
	sub?: string;
	// yandex
	id?: string;
	login?: string;
	client_id?: string;
	psuid?: string;
	emails?: string[];
	default_email?: string;
	is_avatar_empty?: boolean;
	default_avatar_id?: string;
	birthday?: string | null;
	first_name?: string;
	last_name?: string;
	display_name?: string;
	real_name?: string;
	sex?: 'male' | 'female' | null;
	default_phone?: { id: number; number: string };
};
