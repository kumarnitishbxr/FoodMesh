import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { LoginDto } from '../dto/login.dto';
import { LogoutDto } from '../dto/logout.dto';
import { MessageResponseDto } from '../dto/message-response.dto';
import { RegisterDto } from '../dto/register.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { AuthUserDto } from '../dto/auth-user.dto';

export function ApiRegister() {
  return applyDecorators(
    ApiOperation({ summary: 'Register a tenant-scoped user account' }),
    ApiBody({ type: RegisterDto }),
    ApiCreatedResponse({ type: AuthResponseDto }),
  );
}

export function ApiLogin() {
  return applyDecorators(
    ApiOperation({ summary: 'Authenticate with email and password' }),
    ApiBody({ type: LoginDto }),
    ApiOkResponse({ type: AuthResponseDto }),
    ApiUnauthorizedResponse({ description: 'Invalid credentials' }),
  );
}

export function ApiLogout() {
  return applyDecorators(
    ApiOperation({ summary: 'Revoke a refresh token and logout' }),
    ApiBearerAuth('access-token'),
    ApiBody({ type: LogoutDto }),
    ApiOkResponse({ type: MessageResponseDto }),
  );
}

export function ApiRefresh() {
  return applyDecorators(
    ApiOperation({ summary: 'Issue a new access token using a refresh token' }),
    ApiBearerAuth('refresh-token'),
    ApiOkResponse({ type: AuthResponseDto }),
  );
}

export function ApiForgotPassword() {
  return applyDecorators(
    ApiOperation({ summary: 'Generate a password reset token' }),
    ApiBody({ type: ForgotPasswordDto }),
    ApiOkResponse({ type: MessageResponseDto }),
  );
}

export function ApiResetPassword() {
  return applyDecorators(
    ApiOperation({ summary: 'Reset password using a password reset token' }),
    ApiBody({ type: ResetPasswordDto }),
    ApiOkResponse({ type: MessageResponseDto }),
  );
}

export function ApiVerifyEmail() {
  return applyDecorators(
    ApiOperation({ summary: 'Verify a user email address' }),
    ApiBody({ type: VerifyEmailDto }),
    ApiOkResponse({ type: MessageResponseDto }),
  );
}

export function ApiMe() {
  return applyDecorators(
    ApiOperation({ summary: 'Get current authenticated user profile' }),
    ApiBearerAuth('access-token'),
    ApiOkResponse({ type: AuthUserDto }),
  );
}
