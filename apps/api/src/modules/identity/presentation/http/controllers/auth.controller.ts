import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../../../application/auth.service';
import { AccessTokenGuard } from '../../../infrastructure/http/guards/access-token.guard';
import { RefreshTokenGuard } from '../../../infrastructure/http/guards/refresh-token.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Public } from '../decorators/public.decorator';
import { AuthenticatedUser } from '../../../application/interfaces/authenticated-user.interface';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { LoginDto } from '../dto/login.dto';
import { LogoutDto } from '../dto/logout.dto';
import { RegisterDto } from '../dto/register.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import {
  ApiForgotPassword,
  ApiLogin,
  ApiLogout,
  ApiMe,
  ApiRefresh,
  ApiRegister,
  ApiResetPassword,
  ApiVerifyEmail,
} from '../swagger/auth.swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiRegister()
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @ApiLogin()
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  @ApiLogout()
  logout(@CurrentUser() user: AuthenticatedUser, @Body() dto: LogoutDto) {
    return this.authService.logout(user, dto);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @ApiRefresh()
  refresh(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.refresh(user);
  }

  @Public()
  @Post('forgot-password')
  @ApiForgotPassword()
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @Post('reset-password')
  @ApiResetPassword()
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Public()
  @Post('verify-email')
  @ApiVerifyEmail()
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  @ApiMe()
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.me(user);
  }
}
