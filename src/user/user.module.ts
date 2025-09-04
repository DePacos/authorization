import { Module } from '@nestjs/common';

import { TokensService } from '@/auth/tokens/tokens.service';
import { PrismaService } from '@/prisma/prisma.service';
import { UserController } from '@/user/user.controller';
import { UserService } from '@/user/user.service';

@Module({
	providers: [UserService, PrismaService, TokensService],
	exports: [UserService],
	controllers: [UserController],
})
export class UserModule {}
