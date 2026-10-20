import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Sunucu hatası oluştu';
    let error = 'Internal Server Error';
    let errors: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || message;
        error = responseObj.error || error;
        // Handle class-validator array errors
        if (Array.isArray(responseObj.message)) {
          errors = responseObj.message;
          message = 'Doğrulama hatası';
        }
      } else {
        message = exceptionResponse as string;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      // Handle MongoDB duplicate key error
      if ((exception as any).code === 11000) {
        status = HttpStatus.CONFLICT;
        const keyValue = (exception as any).keyValue;
        const key = Object.keys(keyValue)[0];
        message = `Bu ${key} zaten kullanımda`;
        error = 'Conflict';
      }
    }

    this.logger.error(
      `${request.method} ${request.url} ${status} - ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(status).json({
      success: false,
      statusCode: status,
      error,
      message,
      errors,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
