import { ConfirmationService } from '@/confirmation/confirmation.service';
import { JwtConfigWorkspace } from '@/config/workspaces/jwt.workspace';
import { TraditionalLoginDto } from '@/auth/dto/login/traditional.dto';
import { ConfirmationDto } from '@/confirmation/confirmation.dto';
import { TokenPayload, AuthTokens } from 'src/@types/Tokens';
import { EmailLoginDto } from '@/auth/dto/login/email.dto';
import { CryptoProvider } from '@/shared/crypto.provider';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/user.entity';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
    UnauthorizedException,
    BadRequestException,
    Injectable,
    Inject,
} from '@nestjs/common';

@Injectable()
export class AuthService {
    private readonly cryptoProvider = CryptoProvider;

    constructor(
        @Inject(JwtService)
        private readonly jwtService: JwtService,
        @Inject(UsersService)
        private readonly usersService: UsersService,
        @Inject(ConfirmationService)
        private readonly confirmationService: ConfirmationService,
        @Inject(JwtConfigWorkspace.KEY)
        private readonly jwtConfig: ConfigType<typeof JwtConfigWorkspace>,
    ) {}

    public async register(credentials: RegisterDto): Promise<void> {
        credentials.password = this.cryptoProvider.generateHashFromPassword(
            credentials.password,
        );

        if (await this.usersService.userExistsByEmail(credentials.email)) {
            throw new BadRequestException('User with this email exists');
        }

        await this.usersService.createUser(credentials);
    }

    public async refreshTokens(refreshToken: string): Promise<AuthTokens> {
        try {
            const token = this.jwtService.verify<TokenPayload>(refreshToken, {
                publicKey: this.jwtConfig.keys.private,
            });

            const user = await this.usersService.getUserByLoginAndRefresh(
                token.email,
                refreshToken,
            );

            return await this.generateNewTokensPair(user);
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    public async loginByConfirmMessage(
        confirmationDto: ConfirmationDto,
    ): Promise<AuthTokens> {
        const user = await this.confirmationService.confirmCode(
            confirmationDto,
        );

        return this.generateNewTokensPair(user);
    }

    public async login(
        credentials: TraditionalLoginDto | EmailLoginDto,
    ): Promise<AuthTokens | void> {
        const user = await this.usersService
            .getUserByEmail(credentials.email)
            .catch(() => {
                throw new UnauthorizedException('Incorrect email');
            });

        if ('password' in credentials) {
            return this.loginUserByTraditionalLogin(user, credentials);
        }

        return this.loginUserByEmailConfirmation(user);
    }

    private async loginUserByEmailConfirmation(
        user: UserEntity,
    ): Promise<void> {
        await this.confirmationService.createConfirmation(user.email, user);
    }

    private async loginUserByTraditionalLogin(
        user: UserEntity,
        credentials: TraditionalLoginDto,
    ): Promise<AuthTokens> {
        await this.validateUserCredentialsOnLogin(user, credentials);
        return this.generateNewTokensPair(user);
    }

    private async validateUserCredentialsOnLogin(
        targetUser: UserEntity,
        userCredentials: TraditionalLoginDto,
    ) {
        const isMatch: boolean = this.cryptoProvider.passwordMatch(
            userCredentials.password,
            targetUser.password,
        );

        if (!isMatch) {
            throw new UnauthorizedException('Incorrect password');
        }
    }

    private async generateNewTokensPair(user: UserEntity): Promise<AuthTokens> {
        const tokens: AuthTokens = this.generateNewAuthTokensPair(user);
        await this.updateUserRefreshToken(user, tokens.refreshToken);
        return tokens;
    }

    public generateNewAuthTokensPair(user: UserEntity): AuthTokens {
        const getTokenPayload = (type): Partial<TokenPayload> => ({
            email: user.email,
            role: user.role,
            type: type,
        });

        return {
            accessToken: this.jwtService.sign(
                {
                    ...getTokenPayload('access'),
                },
                {
                    privateKey: this.jwtConfig.keys.private,
                    expiresIn: '30m',
                    algorithm: 'HS512',
                    issuer: 'vityaz',
                },
            ),
            refreshToken: this.jwtService.sign(
                {
                    ...getTokenPayload('refresh'),
                },
                {
                    privateKey: this.jwtConfig.keys.private,
                    expiresIn: '12h',
                    algorithm: 'HS512',
                    issuer: 'vityaz',
                },
            ),
        };
    }

    private updateUserRefreshToken(user: UserEntity, refreshToken: string) {
        user.refresh = refreshToken;
        return user.save();
    }
}
