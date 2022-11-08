import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        description: "The email of the user",
        example: "email@gmail.com",
        required: true,
        maxLength: 255,
    })
    @IsEmail()
    @IsString()
    email: string;

    @ApiProperty({
        description: "The password of the user",
        example: "123456",
        required: true,
        maxLength: 12,
        minLength: 6,
    })
    @IsString()
    password: string;
}
