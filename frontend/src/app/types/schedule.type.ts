export type ScheduleType = {
    id: number 
    date: Date
    starts_at: Date
    ends_at: Date,
    employee_user: {
        id: number 
        first_name: string 
        last_name: string
    }
}