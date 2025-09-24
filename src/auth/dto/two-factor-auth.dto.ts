import { IsNotEmpty, Length } from 'class-validator';

import { IsValidToken } from '@/decorators/validation.decorator';

export class TwoFactorAuthDto {
	@IsValidToken()
	tokenUuid: string;

	@IsNotEmpty({ message: 'Code is required' })
	@Length(6, 6, { message: 'Code must be exactly 6 characters' })
	token: string;
}
