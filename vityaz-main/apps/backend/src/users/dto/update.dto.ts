import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({ required: false })
    public readonly firstname?: string;

    @ApiProperty({ required: false })
    public readonly lastname?: string;

    @ApiProperty({ required: false })
    public readonly email?: string;
}
