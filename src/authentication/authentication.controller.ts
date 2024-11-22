import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginRequestDto } from './dto/request/login-request.dto';
import { RegisterRequestDto } from './dto/request/register-request.dto';

@Controller('authentication')
export class AuthenticationController {
  private readonly logger = new Logger(AuthenticationController.name);

  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('/register')
  register(@Body() registerDto: RegisterRequestDto) {
    this.logger.log(`register(registerDto : ${JSON.stringify(registerDto)});`);

    return this.authenticationService.register(registerDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginRequestDto) {
    this.logger.log(`login(loginDto : ${JSON.stringify(loginDto)});`);

    return this.authenticationService.login(loginDto);
  }
}
