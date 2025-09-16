import { Validate } from 'class-validator';

import { IsPasswordMatching } from '@/decorators/password.matching.decorator';
import { IsValidEmail, IsValidPassword, IsValidToken } from '@/decorators/validation.decorator';

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
