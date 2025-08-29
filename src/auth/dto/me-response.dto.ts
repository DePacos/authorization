import { UserRole } from '@prisma/__generated__';
import { Expose } from 'class-transformer';

export class MeResponseDto {
	constructor(partial: Partial<MeResponseDto>) {
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
