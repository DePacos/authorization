import { IsValidToken } from '@/decorators/validation.decorator';

export class EmailConfirmationDto {
	@IsValidToken()
	token: string;
}
