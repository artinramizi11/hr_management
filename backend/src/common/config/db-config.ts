import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import { Attendance } from "src/common/db/entities/attendance.entity";
import { EmployeeUser } from "src/common/db/entities/employee-user.entity";
import { Schedule } from "src/common/db/entities/schedule.entity";
import { User } from "src/common/db/entities/user.entity";

export const dbConfig: TypeOrmModuleAsyncOptions = {
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
        return {
                 host:"localhost",
            port: 5432,
            username: configService.get("database").username,
            type:"postgres",
            database: configService.get("database").database,
            password: configService.get("database").password,
            entities: [User,EmployeeUser,Schedule,Attendance],
            synchronize: true
              }
    }
}