import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class LoginResponseDto {
	@IsString()
	@IsOptional()
	accessToken?: string;

	@IsString()
	@IsOptional()
	tokenId?: string;

	@IsBoolean()
	@IsOptional()
	sentMessage?: boolean;
}
