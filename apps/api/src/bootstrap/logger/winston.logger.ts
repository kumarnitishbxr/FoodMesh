import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createLogger, format, transports, Logger as WinstonLoggerInstance } from 'winston';

@Injectable()
export class WinstonLogger implements LoggerService {
  private readonly logger: WinstonLoggerInstance;

  constructor(private readonly configService: ConfigService) {
    const appName = this.configService.get<string>('APP_NAME') ?? 'foodmesh-api';
    const environment = this.configService.get<string>('NODE_ENV') ?? 'development';
    const logLevel = this.configService.get<string>('LOG_LEVEL') ?? 'info';

    this.logger = createLogger({
      level: logLevel,
      defaultMeta: {
        app: appName,
        environment,
      },
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.metadata({ fillExcept: ['level', 'message', 'timestamp'] }),
        environment === 'production' ? format.json() : format.combine(format.colorize(), format.printf(
          ({ level, message, timestamp, stack, metadata }) =>
            `${timestamp} ${level}: ${stack ?? message} ${this.stringifyMetadata(metadata)}`,
        )),
      ),
      transports: [new transports.Console()],
    });
  }

  log(message: unknown, context?: string): void {
    this.logger.info(this.toMessage(message), { context });
  }

  error(message: unknown, trace?: string, context?: string): void {
    this.logger.error(this.toMessage(message), { context, trace });
  }

  warn(message: unknown, context?: string): void {
    this.logger.warn(this.toMessage(message), { context });
  }

  debug(message: unknown, context?: string): void {
    this.logger.debug(this.toMessage(message), { context });
  }

  verbose(message: unknown, context?: string): void {
    this.logger.verbose(this.toMessage(message), { context });
  }

  private toMessage(message: unknown): string {
    return message instanceof Error ? message.message : String(message);
  }

  private stringifyMetadata(metadata: unknown): string {
    if (!metadata || (typeof metadata === 'object' && Object.keys(metadata as object).length === 0)) {
      return '';
    }

    return JSON.stringify(metadata);
  }
}
