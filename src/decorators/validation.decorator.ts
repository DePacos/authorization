import { applyDecorators } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

import { PASSWORD_REGEX } from '@/constants/app.constant';

export const IsValidPassword = () => {
	return applyDecorators(
		IsNotEmpty({ message: 'password is required' }),
		Matches(PASSWORD_REGEX, { message: 'password is not valid' }),
	);
};

export const IsValidName = () => {
	return applyDecorators(
		MaxLength(30, { message: 'maximum name length 30 characters' }),
		IsString({ message: 'name must be a string' }),
		IsNotEmpty({ message: 'name is required' }),
	);
};

export const IsValidEmail = () => {
	return applyDecorators(IsEmail({}, { message: 'email is not valid' }), IsNotEmpty({ message: 'email is required' }));
};
