import { Module } from '@nestjs/common';

import { TokensService } from '@/auth/tokens/tokens.service';
import { TwoFactorAuthController } from '@/auth/two-factor-auth/two-factor-auth.controller';
import { TwoFactorAuthService } from '@/auth/two-factor-auth/two-factor-auth.service';
import { MailService } from '@/mail/mail.service';
import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/user/user.service';

@Module({
	controllers: [TwoFactorAuthController],
	providers: [TwoFactorAuthService, UserService, TokensService, MailService, PrismaService],
	exports: [TwoFactorAuthService],
})
export class TwoFactorAuthModule {}
