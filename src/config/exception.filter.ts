import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {

    const ctx = host.switchToHttp();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
              : HttpStatus.INTERNAL_SERVER_ERROR;
      
      
    const message = 
        exception instanceof HttpException 
            ? exception.message
              : String(exception);
      
      const response = ctx.getResponse();
      
      response.status(status).json({
          status,
          message,
          data: null
        });
  }
}
