import { Injectable, Logger } from '@nestjs/common';
import { TokenResponseDto } from '../authentication/dto/response/token-response.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwt-payload';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(private readonly jwtService: JwtService) {}

  validateToken(token: string): JwtPayload | null {
    this.logger.log(`validateToken(token : ${token});`);

    const payload = this.jwtService.decode<JwtPayload>(token);

    if (!payload || !payload.username || !payload.role) {
      this.logger.error('Token invalid');

      return null;
    }

    return payload;
  }

  getTokenResponse(payload: JwtPayload): TokenResponseDto {
    this.logger.log(`getTokenResponse(payload : ${JSON.stringify(payload)} )`);

    return { accessToken: this.jwtService.sign(payload) };
  }
}
