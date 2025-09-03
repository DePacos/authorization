import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { jwtVerify, SignJWT } from 'jose';
import { createHash, createSecretKey, randomBytes, randomUUID } from 'node:crypto';

import { SaveTokenData } from '@/auth/tokens/types/token.types';
import { ENCRYPTION_ALG } from '@/constants/app.constant';
import { PrismaService } from '@/prisma/prisma.service';
import { ms, StringValue } from '@/utils/time-to-ms.utils';

@Injectable()
export class TokensService {
	constructor(
		private readonly configService: ConfigService,
		private readonly prismaService: PrismaService,
	) {}

	public getSecretKey(encoding = ENCRYPTION_ALG.BASE64URL) {
		const authStateSecret = this.configService.getOrThrow<string>('TOKEN_SECRET');
		return createSecretKey(authStateSecret, encoding);
	}

	public generateRandomBytes(length = ENCRYPTION_ALG.LENGTH64, encoding = ENCRYPTION_ALG.BASE64URL) {
		return randomBytes(length).toString(encoding);
	}

	public generateHash(value: string, alg = ENCRYPTION_ALG.SHA256, encoding = ENCRYPTION_ALG.BASE64URL) {
		return createHash(alg).update(value).digest().toString(encoding);
	}

	public async getAccessToken(userId: string) {
		const key = this.getSecretKey();
		const accessTtl = this.configService.getOrThrow<StringValue>('TOKEN_ACCESS_TTL');

		const accessToken = await new SignJWT({ sub: userId })
			.setProtectedHeader({ alg: ENCRYPTION_ALG.HS256 })
			.setIssuedAt()
			.setExpirationTime(accessTtl)
			.sign(key);

		return { accessToken };
	}

	public async getRefreshTokens(userId: string) {
		const key = this.getSecretKey();
		const refreshJti = randomUUID();
		const refreshTtl = this.configService.getOrThrow<StringValue>('TOKEN_REFRESH_TTL');

		const refreshToken = await new SignJWT({ sub: userId })
			.setProtectedHeader({ alg: ENCRYPTION_ALG.HS256 })
			.setJti(refreshJti)
			.setIssuedAt()
			.setExpirationTime(refreshTtl)
			.sign(key);

		const refreshExpires = Date.now() + ms(refreshTtl);

		return { refreshToken, refreshJti, refreshExpires };
	}

	public async saveToken(userId: string, email: string, data: SaveTokenData) {
		const { token, tokenType: type, tokenJti: jti, tokenExpires } = data;
		const tokenHash = await argon2.hash(token);

		await this.prismaService.token.upsert({
			where: { user_type_unique: { userId, type } },
			update: {
				token: tokenHash,
				type,
				expiresAt: new Date(tokenExpires),
				jti,
			},
			create: {
				userId,
				email,
				token: tokenHash,
				type,
				expiresAt: new Date(tokenExpires),
				jti,
			},
		});
	}

	public async removeToken(token: string) {
		const key = this.getSecretKey();
		const { payload } = await jwtVerify(token, key);
		const jti = payload.jti;

		if (!payload.jti) throw new UnauthorizedException('token has no jti');

		const foundRow = await this.prismaService.token.findUnique({ where: { jti } });
		if (!foundRow) throw new UnauthorizedException('invalid token');

		if (!(await argon2.verify(foundRow.token, token))) throw new UnauthorizedException('invalid token');

		await this.prismaService.token.delete({ where: { jti } });
	}
}
