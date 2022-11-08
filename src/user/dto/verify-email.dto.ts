import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class VerifyEmailDto {
    @ApiProperty({
        description: "Email",
        example: "Verify email code",
        format: "string",

    })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(6)
    code: string;
}