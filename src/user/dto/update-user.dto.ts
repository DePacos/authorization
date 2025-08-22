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

	@ValidateIf((o: UpdateUserDto) => !o.password)
	@Validate(IsPasswordMatching)
	passwordRepeat?: string;

	@IsOptional()
	@IsBoolean()
	isTwoFactorEnable?: boolean;
}
