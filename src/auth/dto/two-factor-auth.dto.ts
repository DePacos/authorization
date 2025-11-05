import { IsNotEmpty, Length } from 'class-validator';

import { IsValidToken } from '@/decorators';

export class TwoFactorAuthDto {
	@IsValidToken()
	tokenId: string;

	@IsNotEmpty({ message: 'Code is required' })
	@Length(6, 6, { message: 'Code must be exactly 6 characters' })
	code: string;
}
