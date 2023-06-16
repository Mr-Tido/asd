import { IsEmail, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmationDto {
    @IsEmail()
    @ApiProperty({
        name: 'email',
        description: 'Электронный адрес пользователя',
        required: true,
        writeOnly: true,
    })
    public email: string;

    @IsInt()
    @ApiProperty({
        name: 'code',
        description: 'Код, прилетевший на его почту',
        required: true,
        writeOnly: true,
    })
    public code: number;
}
