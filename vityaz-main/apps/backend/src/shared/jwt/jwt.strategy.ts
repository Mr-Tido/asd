import { UnauthorizedException, Injectable, Inject } from '@nestjs/common';
import { JwtConfigWorkspace } from '@/config/workspaces/jwt.workspace';
import { UsersService } from '@/users/users.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UserEntity } from '@/users/user.entity';
import { ConfigType } from '@nestjs/config';
import { TokenPayload } from 'types/Tokens';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        @Inject(JwtConfigWorkspace.KEY)
        private readonly jwtConfig: ConfigType<typeof JwtConfigWorkspace>,
        private readonly usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConfig.keys.private,
        });
    }

    public async validate(payload: TokenPayload): Promise<UserEntity> {
        if (payload.type !== 'access') throw new UnauthorizedException();

        const user = await this.usersService.getUserByEmail(payload.email);
        if (!user) throw new UnauthorizedException();
        return user;
    }
}
