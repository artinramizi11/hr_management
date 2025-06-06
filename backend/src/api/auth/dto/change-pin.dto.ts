import { IsString } from "class-validator";

export class ChangePinDto {
    @IsString()
    pin: string
}