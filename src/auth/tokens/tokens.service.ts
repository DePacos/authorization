import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Tokens } from '@prisma/__generated__';
import * as argon2 from 'argon2';
import { jwtVerify, SignJWT } from 'jose';
import { createHash, createSecretKey, randomBytes, randomUUID } from 'node:crypto';

import { SaveTokenData } from '@/auth/tokens/types';
import { ENCRYPTION_ALG } from '@/constants';
import { PrismaService } from '@/prisma';
import { ms, StringValue } from '@/utils';

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

	public async getTokenById(tokenId: string) {
		return this.prismaService.token.findUnique({ where: { id: tokenId } });
	}

	public async getTokenByUserIdTokenType(userId: string, tokenType: Tokens) {
		return this.prismaService.token.findUnique({ where: { user_type_unique: { userId, type: tokenType } } });
	}

	public async getAccessToken(userId: string, refreshTokenUuid: string) {
		const key = this.getSecretKey();
		const accessTtl = this.configService.getOrThrow<StringValue>('TOKEN_ACCESS_TTL');

		const accessToken = await new SignJWT({ userId })
			.setProtectedHeader({ alg: ENCRYPTION_ALG.HS256 })
			.setJti(refreshTokenUuid)
			.setIssuedAt()
			.setExpirationTime(accessTtl)
			.sign(key);

		return { accessToken };
	}

	public async getRefreshTokens(userId: string) {
		const key = this.getSecretKey();
		const refreshTokenId = randomUUID();
		const refreshTtl = this.configService.getOrThrow<StringValue>('TOKEN_REFRESH_TTL');

		const refreshToken = await new SignJWT({ userId })
			.setProtectedHeader({ alg: ENCRYPTION_ALG.HS256 })
			.setJti(refreshTokenId)
			.setIssuedAt()
			.setExpirationTime(refreshTtl)
			.sign(key);

		return { refreshToken, refreshTokenId, refreshTtl: ms(refreshTtl) };
	}

	public getVerifyToken() {
		const verifierToken = this.generateRandomBytes();
		const verifierTokenId = randomUUID();
		const verifierTtl = ms(this.configService.getOrThrow<StringValue>('TOKEN_VERIFY_TTL'));

		return { verifierToken, verifierTokenId, verifierTtl };
	}

	public getTwoFactorToken() {
		const twoFactorToken = Math.floor(Math.random() * (1000000 - 100000) + 100000).toString();
		const twoFactorTtl = ms(this.configService.getOrThrow<StringValue>('TOKEN_TWO_FACTOR_TTL'));

		return { twoFactorToken, twoFactorTtl };
	}

	public async verifyAccessToken(token: string) {
		const key = this.getSecretKey();

		try {
			const { payload } = await jwtVerify(token, key, { clockTolerance: '5s' });
			if (!payload?.userId || !payload?.jti) throw new UnauthorizedException('Token payload invalid');

			return { userId: payload.userId as string, refreshTokenId: payload.jti };
		} catch {
			throw new UnauthorizedException('AccessToken invalid');
		}
	}

	public async verifyRefreshToken(token: string) {
		const key = this.getSecretKey();

		try {
			const { payload } = await jwtVerify(token, key, { clockTolerance: '5s' });
			if (!payload?.userId || !payload?.jti) throw new UnauthorizedException('Token payload invalid');

			return this.verifyToken(token, payload.jti);
		} catch {
			throw new UnauthorizedException('RefreshToken invalid');
		}
	}

	public async verifyConfirmationToken(token: string, isExpires?: boolean) {
		const [tokenData, tokenId] = token.split('.');
		if (!tokenData || !tokenId) throw new BadRequestException('Token invalid');

		return await this.verifyToken(tokenData, tokenId, isExpires);
	}

	public async verifyToken(token: string, tokenId: string, isExpires?: boolean) {
		const foundTokenRow = await this.getTokenById(tokenId);

		//todo make multiple input attempts

		if (!foundTokenRow) {
			await this.removeToken(tokenId);
			throw new ConflictException('Token not found');
		}
		if (!(await argon2.verify(foundTokenRow.token, token))) {
			await this.removeToken(tokenId);
			throw new ConflictException('Token not verified');
		}
		if (isExpires && foundTokenRow.expiresAt < new Date()) {
			await this.removeToken(tokenId);
			throw new ConflictException('Token expired');
		}

		return { foundTokenRow };
	}

	public async saveToken(data: SaveTokenData) {
		const { id, userId, email, token, tokenType: type, tokenTtl } = data;
		const tokenHash = await argon2.hash(token);
		const expiresAt = new Date(tokenTtl + Date.now());

		return this.prismaService.token.create({
			data: {
				id,
				userId,
				email,
				token: tokenHash,
				type,
				expiresAt,
			},
		});
	}

	public async removeToken(tokenId: string) {
		const token = await this.prismaService.token.findUnique({
			where: { id: tokenId },
		});
		if (!token) throw new NotFoundException('Token not found');

		await this.prismaService.token.delete({ where: { id: tokenId } });
	}
}
