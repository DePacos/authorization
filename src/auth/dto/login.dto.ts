import { IsValidEmail, IsValidPassword } from '@/decorators';

export class LoginDto {
	@IsValidEmail()
	email: string;

	@IsValidPassword()
	password: string;
}
