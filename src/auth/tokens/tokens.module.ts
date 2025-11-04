import { Module } from '@nestjs/common';

import { TokensService } from '@/auth/tokens';

@Module({
	providers: [TokensService],
	exports: [TokensService],
})
export class TokensModule {}
