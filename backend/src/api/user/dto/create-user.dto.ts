import { Scope } from "@nestjs/common";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Role } from "src/common/enums/role.enum";

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    username: string 

    @IsEnum(Role)
    role: Role

    @IsNotEmpty()
    @IsString()
    pin: string



}