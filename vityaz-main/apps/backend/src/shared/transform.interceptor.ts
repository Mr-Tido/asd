import { instanceToPlain } from 'class-transformer';
import { isArray } from 'class-validator';
import { Observable, map } from 'rxjs';
import {
    ExecutionContext,
    NestInterceptor,
    CallHandler,
    Injectable,
} from '@nestjs/common';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    public intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<any> {
        const transformObject = (object: any): any => {
            if (object === null) return undefined;

            if (isArray(object)) {
                return object.map(transformObject);
            }

            if (typeof object === 'object') {
                for (const key in object) {
                    object[key] = transformObject(object[key]);
                }
            }

            return object;
        };

        return next.handle().pipe(
            map((instanceData) => {
                const plainData = instanceToPlain(instanceData);
                return transformObject(plainData);
            }),
        );
    }
}
