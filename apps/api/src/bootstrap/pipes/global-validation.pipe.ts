import { BadRequestException, Injectable, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Injectable()
export class GlobalValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors: ValidationError[]) =>
        new BadRequestException({
          code: 'validation_error',
          message: 'Request validation failed.',
          details: errors.map((error) => ({
            field: error.property,
            constraints: error.constraints ?? {},
          })),
        }),
    });
  }
}
