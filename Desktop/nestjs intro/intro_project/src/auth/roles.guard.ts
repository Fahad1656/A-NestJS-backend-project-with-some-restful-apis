import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from './role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No roles required, access granted
    }
    console.log(requiredRoles)
    const { user } = context.switchToHttp().getRequest();


    // Ensure user and user.roles exist and are arrays
    if (!user || !Array.isArray(user.roles)) {
      throw new UnauthorizedException('Unauthorizede access');
    }

    // Check if user has any of the required roles
    const hasPermission = requiredRoles.some((role) =>
      user.roles.includes(role),
    
    );
    console.log(hasPermission)

    if (!hasPermission) {
      throw new UnauthorizedException('Unauthorized access');
    }

    return true;
  }
}
