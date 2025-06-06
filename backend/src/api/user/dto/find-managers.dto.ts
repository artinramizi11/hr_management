import { Type } from "class-transformer";
import { IsInt } from "class-validator";

export class FindManagersDto {
    @IsInt()
    @Type(() => Number)
    page: number 

    @IsInt()
    @Type(() => Number)
    pageSize: number
}