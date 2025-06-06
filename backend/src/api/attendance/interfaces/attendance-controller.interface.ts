import { ExitAttendanceDto } from "../dto/exit-attendance.dto";
import { MakeAttendanceDto } from "../dto/make-attendance.dto";

export interface IAttendanceController {
    enterOn(makeAttendance: MakeAttendanceDto): any
    leaveOn(exitAttendance: ExitAttendanceDto): any
}