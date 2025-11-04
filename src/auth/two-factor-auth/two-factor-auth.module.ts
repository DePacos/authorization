import { Module } from '@nestjs/common';

import { TokensService } from '@/auth/tokens';
import { TwoFactorAuthController } from '@/auth/two-factor-auth/two-factor-auth.controller';
import { TwoFactorAuthService } from '@/auth/two-factor-auth/two-factor-auth.service';
import { MailService } from '@/mail';
import { PrismaService } from '@/prisma';
import { UserService } from '@/user';

@Module({
	controllers: [TwoFactorAuthController],
	providers: [TwoFactorAuthService, UserService, TokensService, MailService, PrismaService],
	exports: [TwoFactorAuthService],
})
export class TwoFactorAuthModule {}
