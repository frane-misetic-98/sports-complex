import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginRequestDto } from './dto/request/login-request.dto';
import { RegisterRequestDto } from './dto/request/register-request.dto';
import { TokenResponseDto } from './dto/response/token-response.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('authentication')
export class AuthenticationController {
  private readonly logger = new Logger(AuthenticationController.name);

  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  register(@Body() registerDto: RegisterRequestDto): Promise<TokenResponseDto> {
    this.logger.log(`register(registerDto : ${JSON.stringify(registerDto)});`);

    return this.authenticationService.register(registerDto);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login with username and password' })
  @ApiResponse({ status: 201, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Bad credentials' })
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginRequestDto): Promise<TokenResponseDto> {
    this.logger.log(`login(loginDto : ${JSON.stringify(loginDto)});`);

    return this.authenticationService.login(loginDto);
  }
}
