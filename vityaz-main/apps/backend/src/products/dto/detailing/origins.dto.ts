import { ApiProperty } from '@nestjs/swagger';

export class OriginsDto {
    @ApiProperty({ isArray: true, readOnly: true })
    public origins: OriginDto[];

    @ApiProperty({ readOnly: true })
    public total: number;
}

export class OriginDto {
    @ApiProperty({ readOnly: true })
    public origin: string;

    @ApiProperty({ readOnly: true })
    public count: number;
}
