import { EmployeeUser } from "src/common/db/entities/employee-user.entity"
import { FindAllDto } from "../dto/find-employees.dto"
import { Schedule } from "src/common/db/entities/schedule.entity"
import { Attendance } from "src/common/db/entities/attendance.entity"

export interface IEmployeeUserController {
  findAllEmployees(query: FindAllDto): Promise<{employees: EmployeeUser[],totalEmployees: number}>
  getTodaySchedule(employeeId: number): Promise<{schedule: Schedule, attendance: Attendance | null}>
  getEmployeeTotalSchedules(employeeId: number): Promise<Schedule[]>
}