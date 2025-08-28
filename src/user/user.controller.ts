import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch } from '@nestjs/common';
import { User } from '@prisma/__generated__';

import { Authorization } from '@/decorators/auth.decorator';
import { Authorized } from '@/decorators/authorized.decorator';
import { ProfileResponseDto } from '@/user/dto/profile-response.dto';
import { UpdateUserDto } from '@/user/dto/update-user.dto';
import { UserService } from '@/user/user.service';

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@Authorization()
	@Get('profile')
	@HttpCode(HttpStatus.OK)
	getUserById(@Authorized<ProfileResponseDto>() user: User) {
		return user;
	}

	@Authorization()
	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	async updateUser(@Param() userId: string, @Body() data: UpdateUserDto) {
		return await this.userService.updateUser(userId, data);
	}
}
