import { Validate } from 'class-validator';

import { IsPasswordMatching } from '@/decorators/password.matching.decorator';
import { IsValidEmail, IsValidName, IsValidPassword } from '@/decorators/validation.decorator';

export class RegisterDto {
	@IsValidName()
	name: string;

	@IsValidEmail()
	email: string;

	@IsValidPassword()
	password: string;

	@Validate(IsPasswordMatching)
	passwordRepeat: string;
}
