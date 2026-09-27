import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistroDto, LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @Post('registro')
  registro(@Body() dto: RegistroDto) {
    return this.authService.registro(dto.email, dto.password);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
