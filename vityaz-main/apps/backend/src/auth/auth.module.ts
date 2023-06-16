import { ConfirmationModule } from '@/confirmation/confirmation.module';
import { JwtConfigWorkspace } from '@/config/workspaces/jwt.workspace';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { AuthController } from '@/auth/auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersModule } from '@/users/users.module';
import { AuthService } from '@/auth/auth.service';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule.forFeature(JwtConfigWorkspace)],
            inject: [JwtConfigWorkspace.KEY],
            useFactory: (jwtConfig: ConfigType<typeof JwtConfigWorkspace>) => ({
                global: true,
                privateKey: jwtConfig.keys.private,
                publicKey: jwtConfig.keys.public,
            }),
        }),
        UsersModule,
        ConfirmationModule,
    ],
    providers: [AuthService, JwtService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
