import { Module } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { UserController } from '@/user/user.controller';
import { UserService } from '@/user/user.service';

@Module({
	providers: [UserService, PrismaService],
	exports: [UserService],
	controllers: [UserController],
})
export class UserModule {}
