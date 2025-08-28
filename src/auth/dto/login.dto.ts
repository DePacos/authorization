import { IsNotEmpty, MaxLength } from 'class-validator';

import { IsValidEmail } from '@/decorators/validation.decorator';

export class LoginDto {
	@IsValidEmail()
	email: string;

	@MaxLength(32, { message: 'maximum password length 30 characters' })
	@IsNotEmpty({ message: 'password is required' })
	password: string;
}
