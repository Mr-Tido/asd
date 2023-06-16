import { ApiProperty } from '@nestjs/swagger';
import {
    MinLength,
    MaxLength,
    IsString,
    IsEmail,
    Matches,
} from 'class-validator';

export class RegisterDto {
    @IsEmail()
    @ApiProperty({
        name: 'email',
        example: 'smoothbronx@xenofium.com',
        writeOnly: true,
        required: true,
    })
    public email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Этот пароль слишком простой',
    })
    @ApiProperty({
        name: 'password',
        example: 'SomePassword1',
        writeOnly: true,
        required: true,
    })
    public password: string;
}
