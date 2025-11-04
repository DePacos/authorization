import { Validate } from 'class-validator';

import { IsPasswordMatching, IsValidEmail, IsValidPassword, IsValidToken } from '@/decorators';

export class PasswordRecoveryEmailDto {
	@IsValidEmail()
	email: string;
}

export class PasswordRecoveryPasswordDto {
	@IsValidPassword()
	password: string;

	@Validate(IsPasswordMatching)
	passwordRepeat: string;

	@IsValidToken()
	token: string;
}

export class PasswordRecoveryTokenDto {
	@IsValidToken()
	token: string;
}
