import { UpdateUserDto } from '@/users/dto/update.dto';
import { User } from '@/shared/handlers/user.handler';
import { JwtAuthGuard } from '@/shared/jwt/jwt.guard';
import { UsersService } from '@/users/users.service';
import { UserEntity } from '@/users/user.entity';
import {
    Controller,
    HttpStatus,
    UseGuards,
    HttpCode,
    Inject,
    Patch,
    Body,
    Get,
    UnauthorizedException,
} from '@nestjs/common';
import {
    ApiBody,
    ApiHeader,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { UserDto } from '@/users/dto/user.dto';

@ApiHeader({
    name: 'Authorization',
    description: 'Bearer access token',
    example: 'Bearer <accessToken>',
    required: true,
})
@ApiException(() => new UnauthorizedException('Invalid access token'), {
    description: 'Пользователь поставил некорректный токен доступа',
})
@ApiTags('Пользователи')
@UseGuards(JwtAuthGuard)
@Controller('/users/')
export class UsersController {
    constructor(
        @Inject(UsersService)
        private readonly usersService: UsersService,
    ) {}

    @ApiBody({ type: UpdateUserDto })
    @ApiNoContentResponse({
        description: 'Успешно обновлена информация о пользователе',
    })
    @ApiOperation({ summary: 'Обновление информации о текущем пользователе' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Patch('/info/')
    public updateUserInformation(
        @User() user: UserEntity,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<void> {
        return this.usersService.updateUserInformation(user, updateUserDto);
    }

    @ApiOkResponse({
        description: 'Успешно получена информация о пользователе',
        type: UserDto,
    })
    @ApiOperation({ summary: 'Получение информации о текущем пользователе' })
    @HttpCode(HttpStatus.OK)
    @Get('/info/')
    public getUserInformation(@User() user: UserEntity): UserEntity {
        return this.usersService.getUserInformation(user);
    }
}
