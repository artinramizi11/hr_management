import { IsInt, IsString } from "class-validator"

export class ExitAttendanceDto {
    @IsInt()
    employee_user_id: number 

    @IsString()
    date: Date

    @IsString()
    exited_at: Date
}