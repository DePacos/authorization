import { IsValidEmail, IsValidPassword } from '@/decorators/validation.decorator';

export class LoginDto {
	@IsValidEmail()
	email: string;

	@IsValidPassword()
	password: string;
}
