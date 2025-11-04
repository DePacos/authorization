import { Validate } from 'class-validator';

import { IsPasswordMatching, IsValidEmail, IsValidName, IsValidPassword } from '@/decorators';

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
