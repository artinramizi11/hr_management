import { IsDate, IsDateString, IsString } from "class-validator"

export class ReminderScheduleDto {
    @IsString()
    start_week_day: string


    @IsString()
    end_week_day: string
}