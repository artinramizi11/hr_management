import { Schedule } from "src/common/db/entities/schedule.entity"
import { CreateScheduleDto } from "../dto/create-schedule.dto"
import { UpdateScheduleDto } from "../dto/update-schedule.dto"

export interface IScheduleController {
  getSchedules():Promise<Schedule[]>
  createSchedule(createSchedule: CreateScheduleDto): Promise<any>
  deleteSchedule(scheduleId: number): Promise<any>
  updateSchedule(scheduleId: number,updateSchedule: UpdateScheduleDto): Promise<any>
}
