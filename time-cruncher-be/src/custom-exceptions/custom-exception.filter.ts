import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { ValidationMessage } from './validation-message.class';
@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter{
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    if (status === 400 && Array.isArray(exception.message)) {
      response
        .status(status)
        .json({
          message: exception.message.map(x => new ValidationMessage(x.property, x.value)),
        });
    } else {
      response
        .status(status)
        .json({
          message: exception.message.message,
        });
    }
  }
}