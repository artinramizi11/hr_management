import { Attendance } from "src/common/db/entities/attendance.entity";
import { EmployeeUser } from "src/common/db/entities/employee-user.entity";
import { Schedule } from "src/common/db/entities/schedule.entity";
import { User } from "src/common/db/entities/user.entity";
import * as dotenv from 'dotenv'
dotenv.config()

export default () => ({
    database: {
         host:"localhost",
            port: 5432,
            username: process.env.DB_USERNAME,
            type:"postgres",
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            entities: [User,EmployeeUser,Schedule,Attendance],
            synchronize: true
    },
    jwt: {
        secret_key: process.env.JWT_SECRET_KEY,
        expires_in: process.env.JWT_EXPIRES_IN
    },
    mailer: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS
    }

})