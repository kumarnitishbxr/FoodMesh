import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WinstonLogger } from '../logger/winston.logger';

@Injectable()
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: WinstonLogger) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;
    const message = this.resolveMessage(exception, exceptionResponse);
    const details =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? exceptionResponse
        : undefined;

    this.logger.error(message, exception instanceof Error ? exception.stack : undefined, 'HTTP');

    response.status(status).json({
      success: false,
      error: {
        code: this.resolveCode(status),
        message,
        details,
      },
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    });
  }

  private resolveMessage(exception: unknown, exceptionResponse: unknown): string {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
    ) {
      const message = (exceptionResponse as { message?: string | string[] }).message;
      return Array.isArray(message) ? message.join(', ') : message ?? 'Request failed.';
    }

    if (exception instanceof Error) {
      return exception.message;
    }

    return 'Internal server error.';
  }

  private resolveCode(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'bad_request';
      case HttpStatus.UNAUTHORIZED:
        return 'unauthorized';
      case HttpStatus.FORBIDDEN:
        return 'forbidden';
      case HttpStatus.NOT_FOUND:
        return 'not_found';
      case HttpStatus.CONFLICT:
        return 'conflict';
      default:
        return 'internal_server_error';
    }
  }
}
