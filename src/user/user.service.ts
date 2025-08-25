import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

import { RegisterDto } from '@/auth/dto/register.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdateUserDto } from '@/user/dto/update-user.dto';

@Injectable()
export class UserService {
	public constructor(private readonly prismaService: PrismaService) {}
	public async findById(id: string) {
		return this.prismaService.user.findUnique({
			where: { id },
			include: { account: true },
		});
	}

	public async findByEmail(email: string) {
		return this.prismaService.user.findUnique({
			where: { email },
			include: { account: true },
		});
	}

	public async createUser(data: Omit<RegisterDto, 'passwordRepeat'>) {
		const { name, email, password } = data;

		await this.prismaService.user.create({
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

	public async updateUser(id: string, data: UpdateUserDto) {
		const { name, password, isTwoFactorEnable } = data;
		const updateData = { isTwoFactorEnable, name };

		if (password) updateData['password'] = argon2.hash(password);

		return this.prismaService.user.update({
			where: { id },
			data,
			select: {
				id: true,
				name: true,
			},
		});
	}
}
