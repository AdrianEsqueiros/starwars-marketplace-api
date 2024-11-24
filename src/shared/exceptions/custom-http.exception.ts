import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomHttpException extends HttpException {
  constructor(
    public readonly message: string,
    public readonly code: string,
    status: HttpStatus,
  ) {
    super({ status: 'error', message, code }, status);
  }
}
