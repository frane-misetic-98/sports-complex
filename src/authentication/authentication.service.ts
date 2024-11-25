import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { LoginRequestDto } from './dto/request/login-request.dto';
import { RegisterRequestDto } from './dto/request/register-request.dto';
import { TokenResponseDto } from './dto/response/token-response.dto';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async login(loginRequest: LoginRequestDto): Promise<TokenResponseDto> {
    this.logger.log(`login( loginRequest : ${JSON.stringify(loginRequest)} )`);

    const user = await this.userService.findByUsername(loginRequest.username);
    if (!user) {
      const message = `User with username ${loginRequest.username} not found`;

      this.logger.error(message);

      throw new BadRequestException(message);
    }

    if (!(await user.validatePassword(loginRequest.password))) {
      const message = 'Invalid password';

      this.logger.error(message);

      throw new BadRequestException(message);
    }

    return this.tokenService.getTokenResponse({
      id: user.id,
      username: user.username,
      role: user.role,
    });
  }

  async register(
    registerRequest: RegisterRequestDto,
  ): Promise<TokenResponseDto> {
    this.logger.log(
      `register( registerRequest : ${JSON.stringify(registerRequest)} )`,
    );

    const user = await this.userService.create(registerRequest);

    return this.tokenService.getTokenResponse({
      id: user.id,
      username: user.username,
      role: user.role,
    });
  }
}
