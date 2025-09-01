import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EncryptJWT, jwtDecrypt } from 'jose';
import { createHash, createSecretKey, randomBytes } from 'node:crypto';

import { OAuthResponse } from '@/auth/provider/types/oauth-response.types';
import { UserInfo } from '@/auth/provider/types/user-info.types';
import { ENCRYPTION_ALG, ROUTES } from '@/constants/app.constant';

import { Provider } from '../types/provider.types';

@Injectable()
export class OAuthService {
	private BASE_URL: string;
	private configService: ConfigService;

	public constructor(private readonly options: Provider) {}

	protected extractUserInfo(data: OAuthResponse): UserInfo {
		return {
			id: data.id || '',
			name: data.name || '',
			email: data.email || '',
			picture: data.picture || '',
			access_token: data.access_token || '',
			refresh_token: data.refresh_token || '',
			provider: this.options.name,
		};
	}

	public async getAuthUrl() {
		const verifier = this.generateCodeVerifier();
		const state = await this.generateState({ verifier });
		const code_challenge = this.generateCodeChallenge(verifier);

		const query = new URLSearchParams({
			response_type: 'code',
			client_id: this.options.clientId,
			redirect_uri: this.getRedirectUrl(),
			scope: (this.options.scopes ?? []).join(' '),
			prompt: 'select_account',
			state,
			code_challenge,
			code_challenge_method: ENCRYPTION_ALG.S256,
		});

		return { url: `${this.options.authorizeUrl}?${query}`, state, verifier };
	}

	public async getUserByCode(code: string, code_verifier: string): Promise<UserInfo> {
		const client_id = this.options.clientId;
		const client_secret = this.options.clientSecret;

		const tokenQuery = new URLSearchParams({
			client_id,
			client_secret,
			code,
			redirect_uri: this.getRedirectUrl(),
			grant_type: 'authorization_code',
			code_verifier: code_verifier,
		});

		const tokenRequest = await fetch(this.options.accessUrl, {
			method: 'POST',
			body: tokenQuery,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Accept: 'application/json',
			},
		});

		const tokenResponse = (await tokenRequest.json()) as UserInfo;

		if (!tokenRequest.ok) {
			throw new BadRequestException('invalid request token');
		}

		if (!tokenResponse.access_token) {
			throw new BadRequestException('invalid response token');
		}

		const userRequest = await fetch(this.options.profileUrl, {
			headers: {
				Authorization: `Bearer ${tokenResponse.access_token}`,
			},
		});

		if (!userRequest.ok) {
			throw new UnauthorizedException('user not found');
		}

		const user = (await userRequest.json()) as OAuthResponse;
		const userData = this.extractUserInfo(user);

		return {
			...userData,
			access_token: tokenResponse.access_token,
			refresh_token: tokenResponse.refresh_token,
			expires_at: tokenResponse.expires_at,
			provider: this.options.name,
		};
	}

	protected getJWTKey(encoding = ENCRYPTION_ALG.BASE64URL) {
		const authStateSecret = this.configService.getOrThrow<string>('AUTH_STATE_SECRET');
		return createSecretKey(authStateSecret, encoding);
	}

	public generateCodeVerifier(length = ENCRYPTION_ALG.LENGTH64, encoding = ENCRYPTION_ALG.BASE64URL) {
		return randomBytes(length).toString(encoding);
	}

	public generateCodeChallenge(verifier: string, alg = ENCRYPTION_ALG.SHA256, encoding = ENCRYPTION_ALG.BASE64URL) {
		const hash = createHash(alg).update(verifier).digest();

		return Buffer.from(hash).toString(encoding);
	}

	public async generateState(payload: { verifier: string }) {
		const key = this.getJWTKey();

		return await new EncryptJWT(payload)
			.setProtectedHeader({ alg: ENCRYPTION_ALG.DIR, enc: ENCRYPTION_ALG.A256GCM })
			.encrypt(key);
	}

	async parseState(state: string) {
		const key = this.getJWTKey();
		const { payload } = await jwtDecrypt(state, key);

		return payload as { verifier: string };
	}

	public getRedirectUrl() {
		return this.BASE_URL + ROUTES.PROVIDER_CALLBACK + this.options.name.toLowerCase();
	}

	get name() {
		return this.options.name;
	}

	set baseUrl(value: string) {
		this.BASE_URL = value;
	}

	public setConfigService(configService: ConfigService) {
		this.configService = configService;
	}
}
