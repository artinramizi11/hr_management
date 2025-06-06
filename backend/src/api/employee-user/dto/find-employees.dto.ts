import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";

export class FindAllDto {
 
    @IsInt()
    @Type(() => Number)
    page: number 

    @IsInt()
    @Type(() => Number)
    size: number

    @IsString()
    @IsOptional()
    name: string
}