import { ApiProperty } from '@nestjs/swagger';
import { Roles } from 'src/@types/Roles';

export type AuthTokens = {
    accessToken: string;
    refreshToken: string;
};

export type TokenPayload = {
    type: 'access' | 'refresh';
    email: string;
    role: Roles;
};

export class AuthTokensDto {
    @ApiProperty({ required: true, readOnly: true })
    public accessToken: string;
    @ApiProperty({ required: true, readOnly: true })
    public refreshToken: string;
}
