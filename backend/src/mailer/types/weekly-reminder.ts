export type SendWeeklyReminder = {
    employeeEmail: string 
    scheduleMail: {
         day: Date
            employee: string
            email: string
            from: Date
            to: Date
    }[],
    scheduleWeek: {
        start: string,
        end: string
    }
}