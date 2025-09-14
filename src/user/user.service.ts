import { Injectable } from '@nestjs/common';
import { AuthProvider } from '@prisma/__generated__';
import * as argon2 from 'argon2';

import { RegisterDto } from '@/auth/dto/register.dto';
import { UserInfo } from '@/auth/provider/types/user-info.types';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdateUserDto } from '@/user/dto/update-user.dto';

@Injectable()
export class UserService {
	public constructor(private readonly prismaService: PrismaService) {}
	public async getUserById(id: string) {
		return this.prismaService.user.findUnique({
			where: { id },
			include: { account: true },
		});
	}

	public async getUserByEmail(email: string) {
		return this.prismaService.user.findUnique({
			where: { email },
			include: { account: true },
		});
	}

	public async createUser(data: Omit<RegisterDto, 'passwordRepeat'>) {
		const { name, email, password } = data;

		return this.prismaService.user.create({
			data: {
				name,
				email,
				password,
				isVerified: false,
				account: {
					create: { type: 'CREDENTIALS', provider: 'LOCAL' },
				},
			},
		});
	}

	public async createUserByProvider(data: UserInfo) {
		const { name, email, provider } = data;
		return this.prismaService.user.create({
			data: {
				name,
				email,
				isVerified: true,
				account: {
					create: {
						type: 'OAUTH',
						provider,
					},
				},
			},
		});
	}

	public async createAccountByProvider(userId: string, provider: AuthProvider) {
		await this.prismaService.account.create({
			data: {
				userId,
				type: 'OAUTH',
				provider,
			},
		});
	}

	public async updateUser(id: string, data: UpdateUserDto) {
		const { name, password, isTwoFactorEnable } = data;
		const updateData = { isTwoFactorEnable, name };

		if (password) updateData['password'] = argon2.hash(password);

		return this.prismaService.user.update({
			where: { id },
			data: updateData,
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
			},
		});
	}

	public async verifyUser(id: string) {
		await this.prismaService.user.update({ where: { id }, data: { isVerified: true } });
	}

	public async changePassword(id: string, newPassword: string) {
		const passwordHash = await argon2.hash(newPassword);
		await this.prismaService.user.update({
			where: { id },
			data: { password: passwordHash },
		});
	}
}
