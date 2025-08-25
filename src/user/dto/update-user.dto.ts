import { IsBoolean, IsOptional, Validate, ValidateIf } from 'class-validator';

import { IsPasswordMatching } from '@/decorator/password.matching.decorator';
import { IsValidName, IsValidPassword } from '@/decorator/validation.decorator';

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

	@IsBoolean()
	isTwoFactorEnable: boolean;
}
