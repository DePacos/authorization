import { Module } from '@nestjs/common';

import { EmailConfirmationController } from '@/auth/email-confirmation/email-confirmation.controller';
import { EmailConfirmationService } from '@/auth/email-confirmation/email-confirmation.service';
import { TokensService } from '@/auth/tokens';
import { MailService } from '@/mail';
import { PrismaService } from '@/prisma';
import { UserService } from '@/user';

@Module({
	controllers: [EmailConfirmationController],
	providers: [EmailConfirmationService, TokensService, UserService, MailService, PrismaService],
	exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
