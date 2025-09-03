import { Module } from '@nestjs/common';

@Module({
	providers: [TokensModule],
	exports: [TokensModule],
})
export class TokensModule {}
