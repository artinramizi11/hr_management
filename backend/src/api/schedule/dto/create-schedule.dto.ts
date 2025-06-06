import { IsDate, IsDateString, IsInt, IsNumber } from "class-validator";

export class CreateScheduleDto {
    @IsDateString()
    date: Date

    @IsDateString()
    starts_at: string 

    @IsDateString()
    ends_at: string 

    @IsInt()
    employee_user_id: number

    @IsInt()
    scheduled_by_user_id: number
}