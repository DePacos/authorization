import { Validate } from 'class-validator';

import { IsPasswordMatching } from '@/decorator/password.matching.decorator';
import { IsValidEmail, IsValidName, IsValidPassword } from '@/decorator/validation.decorator';

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
