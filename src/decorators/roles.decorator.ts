import { SetMetadata } from '@nestjs/common';
import { $Enums } from '@prisma/__generated__';

import { ROLES_KEY } from '@/constants/app.constant';

import UserRole = $Enums.UserRole;

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
