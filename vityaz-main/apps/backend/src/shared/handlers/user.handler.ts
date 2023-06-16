import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '@/users/user.entity';

export const User = createParamDecorator(
    (data, context: ExecutionContext): UserEntity => {
        const request = context.switchToHttp().getRequest();
        return request.user;
    },
);
