import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SupportRequestDto {
    @IsString()
    @ApiProperty({
        name: 'firstname',
        description: 'Имя',
        example: 'Иван',
        writeOnly: true,
        required: true,
    })
    public firstname: string;

    @IsString()
    @ApiProperty({
        name: 'lastname',
        description: 'Фамилия',
        example: 'Иванов',
        writeOnly: true,
        required: true,
    })
    public lastname: string;

    @IsString()
    @IsEmail()
    @ApiProperty({
        name: 'email',
        description: 'Адрес электронной почты пользователя',
        example: 'smoothbronx@xenofium.com',
        writeOnly: true,
        required: true,
    })
    public email: string;

    @IsString()
    @ApiProperty({
        name: 'message',
        description: 'Сообщение',
        example: 'Помогите!!..',
        writeOnly: true,
        required: true,
    })
    public message: string;
}
