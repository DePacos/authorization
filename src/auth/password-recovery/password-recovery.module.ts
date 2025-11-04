import { Module } from '@nestjs/common';

import { PasswordRecoveryController } from '@/auth/password-recovery/password-recovery.controller';
import { PasswordRecoveryService } from '@/auth/password-recovery/password-recovery.service';
import { TokensService } from '@/auth/tokens';
import { MailService } from '@/mail';
import { PrismaService } from '@/prisma';
import { UserService } from '@/user';

@Module({
	controllers: [PasswordRecoveryController],
	providers: [PasswordRecoveryService, TokensService, UserService, MailService, PrismaService],
	exports: [PasswordRecoveryService],
})
export class PasswordRecoveryModule {}
