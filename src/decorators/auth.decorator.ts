import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/__generated__';

import { Roles } from '@/decorators/roles.decorator';
import { AuthGuard } from '@/guards/auth.guard';
import { RolesGuard } from '@/guards/roles.guard';

export const Authorization = (...roles: UserRole[]) => {
	if (roles.length) {
		return applyDecorators(Roles(...roles), UseGuards(AuthGuard, RolesGuard));
	}

	return applyDecorators(UseGuards(AuthGuard));
};
