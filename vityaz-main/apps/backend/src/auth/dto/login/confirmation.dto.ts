import { IsEmail, IsInt, IsString } from 'class-validator';

export class EmailConfirmationDto {
    @IsString()
    @IsEmail()
    public readonly email: string;

    @IsInt()
    public readonly code: number;
}
