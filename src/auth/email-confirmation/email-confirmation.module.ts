import { Module } from '@nestjs/common';

import { EmailConfirmationService } from '@/auth/email-confirmation/email-confirmation.service';
import { TokensService } from '@/auth/tokens/tokens.service';

@Module({
	providers: [EmailConfirmationService, TokensService],
	exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
