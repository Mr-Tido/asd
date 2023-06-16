import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailLoginDto {
    @ApiProperty({
        description: 'Адрес электронной почты пользователя',
        required: true,
    })
    @IsString()
    @IsEmail()
    public readonly email: string;
}
