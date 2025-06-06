import { IsDate, IsInt, IsString } from "class-validator";
import { Timestamp } from "typeorm";

export class MakeAttendanceDto {

    @IsInt()
    employee_user_id: number

    @IsString()
    date: Date
 
    @IsString()
    entered_at: Date


    
}

