import { IsBoolean } from 'class-validator';

export class SentMailResponseDto {
	@IsBoolean()
	sentMessage: boolean;
}
