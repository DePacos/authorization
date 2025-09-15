import { IsBoolean } from 'class-validator';

export class ConfirmationResponseDto {
	@IsBoolean()
	success: boolean;
}
