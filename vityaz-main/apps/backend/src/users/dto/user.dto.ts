import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty({ readOnly: true })
    public readonly id: string;

    @ApiProperty({ required: true })
    public firstname: string;

    @ApiProperty({ required: true })
    public lastname: string;

    @ApiProperty({ required: true })
    public email: string;
}
