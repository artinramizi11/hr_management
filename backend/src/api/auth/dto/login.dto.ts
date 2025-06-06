import { IsInt, IsString } from "class-validator";

export class LoginDto {
    @IsString()
    pin: string
}