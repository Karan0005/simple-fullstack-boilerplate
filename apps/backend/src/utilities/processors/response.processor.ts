import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IBaseResponse } from '../interfaces';
import { BaseMessage } from '../constants';

@Injectable()
export class ResponseProcessor<T> implements NestInterceptor<T, IBaseResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<IBaseResponse<T>> {
        if (context.getType() === 'http') {
            return next.handle().pipe(
                map((data) => {
                    return {
                        IsSuccess: true,
                        Message: BaseMessage.Success.SuccessGeneral,
                        Data: data || {},
                        Errors: []
                    };
                })
            );
        } else {
            return next.handle().pipe(
                map((data) => {
                    return data;
                })
            );
        }
    }
}
