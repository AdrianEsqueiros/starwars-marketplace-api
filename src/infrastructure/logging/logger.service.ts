import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService extends Logger {
  logInfo(message: string, context?: string): void {
    super.log(message, context);
  }

  logError(message: string, trace: string, context?: string): void {
    super.error(message, trace, context);
  }

  logWarning(message: string, context?: string): void {
    super.warn(message, context);
  }
}
