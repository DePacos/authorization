import { applyDecorators } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

import { PASSWORD_REGEX } from '@/constants/app.constant';

export const IsValidPassword = () => {
	return applyDecorators(
		IsNotEmpty({ message: 'Password is required' }),
		IsString({ message: 'Name must be a string' }),
		MaxLength(30, { message: 'maximum password length 30 characters' }),
		Matches(PASSWORD_REGEX, { message: 'Password is not valid' }),
	);
};

export const IsValidName = () => {
	return applyDecorators(
		MaxLength(30, { message: 'Maximum name length 30 characters' }),
		IsString({ message: 'Name must be a string' }),
		IsNotEmpty({ message: 'Name is required' }),
	);
};

export const IsValidEmail = () => {
	return applyDecorators(IsEmail({}, { message: 'Email is not valid' }), IsNotEmpty({ message: 'email is required' }));
};

export const IsValidToken = () => {
	return applyDecorators(IsNotEmpty({ message: 'Token is required' }), IsString({ message: 'token must be a string' }));
};
