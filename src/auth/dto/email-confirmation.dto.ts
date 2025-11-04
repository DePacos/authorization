import { IsValidToken } from '@/decorators';

export class EmailConfirmationDto {
	@IsValidToken()
	token: string;
}
