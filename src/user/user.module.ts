import { Module } from '@nestjs/common';

import { TokensService } from '@/auth/tokens';
import { PrismaService } from '@/prisma';
import { UserController } from '@/user/user.controller';
import { UserService } from '@/user/user.service';

@Module({
	controllers: [UserController],
	providers: [UserService, PrismaService, TokensService],
	exports: [UserService],
})
export class UserModule {}
