import { UserRole } from '@prisma/__generated__';
import { Expose } from 'class-transformer';

export class ProfileResponseDto {
	constructor(partial: Partial<ProfileResponseDto>) {
		Object.assign(this, partial);
	}

	@Expose()
	id: string;

	@Expose()
	name: string;

	@Expose()
	email: string;

	@Expose()
	role: UserRole;

	@Expose()
	isTwoFactorEnable: boolean;

	@Expose()
	createdAt: Date;

	@Expose()
	updatedAt: Date;
}
