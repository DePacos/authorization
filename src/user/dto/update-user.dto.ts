import { IsBoolean, IsOptional, Validate, ValidateIf } from 'class-validator';

import { IsPasswordMatching } from '@/decorators/password.matching.decorator';
import { IsValidName, IsValidPassword } from '@/decorators/validation.decorator';

export class UpdateUserDto {
	@IsOptional()
	@IsValidName()
	name?: string;

	@IsOptional()
	@IsValidPassword()
	password?: string;

	@ValidateIf((user: UpdateUserDto) => !user.password)
	@Validate(IsPasswordMatching)
	passwordRepeat?: string;

	@IsOptional()
	@IsBoolean()
	isTwoFactorEnable?: boolean;
}
