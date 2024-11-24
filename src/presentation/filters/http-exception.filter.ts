import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { CustomHttpException } from '@/shared/exceptions/custom-http.exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    if (exception instanceof CustomHttpException) {
      this.logger.error(
        `${request.method} ${request.url} -> Status: ${status}, Code: ${exception.code}, Error: ${exception.message}`,
      );

      response.status(status).json({
        status: 'error',
        code: exception.code,
        message: exception.message,
        data: [],
      });
      return;
    }

    // Manejar otras excepciones HTTP
    this.logger.error(
      `${request.method} ${request.url} -> Status: ${status}, Error: ${JSON.stringify(
        exceptionResponse,
      )}`,
    );

    response.status(status).json({
      status: 'error',
      message: exception.message,
      data: [],
    });
  }
}
