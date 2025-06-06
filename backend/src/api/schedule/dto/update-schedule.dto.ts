import { PartialType } from "@nestjs/mapped-types";
import { CreateScheduleDto } from "./create-schedule.dto";
import { IsDateString, IsInt } from "class-validator";

export class UpdateScheduleDto  {
      @IsDateString()
        date: Date
    
        @IsDateString()
        starts_at: string 
    
        @IsDateString()
        ends_at: string 

            @IsInt()
            employee_user_id: number
}