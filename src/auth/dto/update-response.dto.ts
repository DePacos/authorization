import { IsString } from 'class-validator';

export class UpdateResponseDto {
	@IsString()
	accessToken?: string;
}
