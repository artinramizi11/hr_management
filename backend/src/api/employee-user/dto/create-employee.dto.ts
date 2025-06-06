import { Scope } from "@nestjs/common"
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator"

export class CreateEmployeeDto {

    @IsEmail()
    @IsNotEmpty()
    email: string 

    @IsString()
    first_name: string 

    @IsString()
    last_name: string


    @IsString()
    @MinLength(6)
    @MaxLength(6)
    pin: string



}