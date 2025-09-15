import { Module } from '@nestjs/common';

import { EmailConfirmationController } from '@/auth/email-confirmation/email-confirmation.controller';
import { EmailConfirmationService } from '@/auth/email-confirmation/email-confirmation.service';
import { TokensService } from '@/auth/tokens/tokens.service';
import { MailService } from '@/mail/mail.service';
import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/user/user.service';

@Module({
	controllers: [EmailConfirmationController],
	providers: [EmailConfirmationService, TokensService, UserService, MailService, PrismaService],
	exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
