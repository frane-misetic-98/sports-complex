import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../../token/token.service';
import { UserService } from '../../user/user.service';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const authHeader = request.headers.authorization;

    const token = authHeader ? authHeader.split(' ')[1] : '';

    const payload = this.tokenService.validateToken(token);
    if (!payload || !payload.username || !payload.role) {
      throw new UnauthorizedException('Invalid token');
    }

    if (!(await this.userService.findByUsername(payload.username))) {
      throw new UnauthorizedException('Invalid user name');
    }

    request['user'] = payload;

    return true;
  }
}
