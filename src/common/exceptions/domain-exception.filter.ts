import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from './domain-exception';
import { NotFoundException } from './not-found-exception';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof NotFoundException) {
      return response.status(404).json({
        statusCode: 404,
        message: exception.message,
      });
    }

    response.status(400).json({
      statusCode: 400,
      message: exception.message,
    });
  }
}
