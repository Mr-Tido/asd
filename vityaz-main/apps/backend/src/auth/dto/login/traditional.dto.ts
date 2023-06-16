import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TraditionalLoginDto {
    @IsString()
    @IsEmail()
    @ApiProperty({
        name: 'string',
        example: 'smoothbronx@xenofium.com',
        writeOnly: true,
        required: true,
    })
    public email: string;

    @IsString()
    @ApiProperty({
        name: 'password',
        example: 'SomePassword1',
        writeOnly: true,
        required: true,
    })
    public password: string;
}
