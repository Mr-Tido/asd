import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { TraditionalLoginDto } from '@/auth/dto/login/traditional.dto';
import { ConfirmationDto } from '@/confirmation/confirmation.dto';
import { AuthTokens, AuthTokensDto } from 'src/@types/Tokens';
import { EmailLoginDto } from '@/auth/dto/login/email.dto';
import { Token } from '@/shared/handlers/token.handler';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { AuthService } from 'src/auth/auth.service';
import {
    MethodNotAllowedException,
    UnauthorizedException,
    BadRequestException,
    HttpStatus,
    Controller,
    HttpCode,
    Inject,
    Body,
    Post,
    Get,
} from '@nestjs/common';
import {
    ApiExtraModels,
    ApiOkResponse,
    ApiOperation,
    ApiHeader,
    ApiBody,
    ApiTags,
    refs,
} from '@nestjs/swagger';

@ApiTags('Аутентификация')
@Controller('/auth/')
export class AuthController {
    constructor(
        @Inject(AuthService)
        private readonly authService: AuthService,
    ) {}

    @ApiBody({
        type: RegisterDto,
        description: 'Реквизиты пользователя для регистрации',
    })
    @ApiException(
        () => new BadRequestException('User with this email exists'),
        {
            description:
                'Пользователь с таким адресом электронной почты уже существует',
        },
    )
    @ApiOperation({ summary: 'Регистрация пользователя в системе' })
    @HttpCode(HttpStatus.CREATED)
    @Post('/register/')
    public register(@Body() registerCredentials: RegisterDto): Promise<void> {
        return this.authService.register(registerCredentials);
    }

    @ApiExtraModels(EmailLoginDto, TraditionalLoginDto)
    @ApiBody({
        schema: { anyOf: refs(EmailLoginDto, TraditionalLoginDto) },
        description: 'Реквизиты пользователя для авторизации',
    })
    @ApiException(() => new UnauthorizedException('Incorrect password'), {
        description: 'Неправильный пароль пользователя',
    })
    @ApiException(() => new UnauthorizedException('Incorrect email'), {
        description: 'Неправильно введен адрес электронной почты',
    })
    @ApiOkResponse({
        description:
            'Пользователь успешно авторизовался в системе и получил пару токенов ' +
            '(Работает в случае использования традиционной авторизации)',
        type: AuthTokensDto,
    })
    @ApiOperation({
        summary: 'Авторизация пользователя в системе или отправка кода',
    })
    @HttpCode(HttpStatus.OK)
    @Post('/login/')
    public login(
        @Body() loginCredentials: TraditionalLoginDto | EmailLoginDto,
    ): Promise<AuthTokens | void> {
        return this.authService.login(loginCredentials);
    }

    @ApiBody({ type: ConfirmationDto })
    @ApiOkResponse({
        description:
            'Пользователь успешно авторизовался в системе и получил пару токенов',
        type: AuthTokensDto,
    })
    @ApiException(() => new BadRequestException('Invalid confirmation code'), {
        description: 'Пользователь ввел неверный код подтверждения',
    })
    @ApiException(
        () =>
            new MethodNotAllowedException(
                'User does not have confirmation mails',
            ),
        {
            description: 'Пользователю не было отправлено писем',
        },
    )
    @ApiOperation({ summary: 'Подтверждение входа через отправленный код' })
    @HttpCode(HttpStatus.OK)
    @Post('/login/confirm')
    public confirm(
        @Body() confirmationDto: ConfirmationDto,
    ): Promise<AuthTokens> {
        return this.authService.loginByConfirmMessage(confirmationDto);
    }

    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer refresh token',
        example: 'Bearer <refreshToken>',
        required: true,
    })
    @ApiException(() => new UnauthorizedException('Invalid refresh token'), {
        description:
            'Пользователь поставил некорректный токен обновления сессии',
    })
    @ApiOkResponse({
        description:
            'Пользователь успешно продлил свою сессию и получил новую пару токенов',
        type: AuthTokensDto,
    })
    @ApiOperation({ summary: 'Продление сессии пользователя' })
    @HttpCode(HttpStatus.OK)
    @Get('/refresh/')
    public async refreshTokens(@Token() refreshToken: string) {
        return this.authService.refreshTokens(refreshToken);
    }
}
