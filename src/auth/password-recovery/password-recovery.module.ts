import { Module } from '@nestjs/common';

import { PasswordRecoveryController } from '@/auth/password-recovery/password-recovery.controller';
import { PasswordRecoveryService } from '@/auth/password-recovery/password-recovery.service';
import { TokensService } from '@/auth/tokens/tokens.service';
import { MailService } from '@/mail/mail.service';
import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/user/user.service';

@Module({
	controllers: [PasswordRecoveryController],
	providers: [PasswordRecoveryService, TokensService, UserService, MailService, PrismaService],
	exports: [PasswordRecoveryService],
})
export class PasswordRecoveryModule {}
