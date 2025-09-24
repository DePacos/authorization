import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class LoginResponseDto {
	@IsString()
	@IsOptional()
	accessToken?: string;

	@IsString()
	@IsOptional()
	tokenUuid?: string;

	@IsBoolean()
	@IsOptional()
	sentMessage?: boolean;
}
