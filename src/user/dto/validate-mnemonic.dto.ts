import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ValidateMnemonicDto {
    @ApiProperty({
        description: "Mnemonic",
        example: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
        uniqueItems: true,
        format: "string",
    })
    @IsNotEmpty()
    @IsString()
    mnemonic: string;
}