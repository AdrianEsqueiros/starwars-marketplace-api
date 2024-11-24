import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction): void {
    this.logger.log(`Incoming Request: ${req.method} ${req.url}`);
    res.on('finish', () => {
      this.logger.log(`Response Status: ${res.statusCode}`);
    });
    next();
  }
}
