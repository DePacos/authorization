import { UserRole } from '@prisma/__generated__';
import { Expose } from 'class-transformer';

export class UpdateUserResponseDto {
	constructor(partial: Partial<UpdateUserResponseDto>) {
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
}
