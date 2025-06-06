import { AbilityBuilder, createMongoAbility, ExtractSubjectType, InferSubjects, MongoAbility } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Attendance } from "src/common/db/entities/attendance.entity";
import { EmployeeUser } from "src/common/db/entities/employee-user.entity";
import { Schedule } from "src/common/db/entities/schedule.entity";
import { User } from "src/common/db/entities/user.entity";
import { Role } from "src/common/enums/role.enum";

export enum Action  {
    Manage = 'manage',
    Read = 'read',
    Delete = 'delete',
    Update = 'update',
    Create = 'create'
}

type Subjects = InferSubjects<typeof User | typeof EmployeeUser | typeof Schedule | typeof Attendance  | 'all'>

export type AppAbility = MongoAbility<[Action,Subjects]>

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: User | EmployeeUser){
        const { can, cannot , build} = new AbilityBuilder(createMongoAbility)

        if(user.scope === 'global'){
            if(user.role === Role.Admin){
               can(Action.Manage, 'all')
            }
            if(user.role == 'manager'){
                can(Action.Manage,EmployeeUser)
                can(Action.Manage,Schedule)
            }
        }

      

       if(user.scope === 'employee'){
        can(Action.Read, Schedule, {employee_user_id: user.id})
        can(Action.Update, Attendance)
       } 

    

return build({
    detectSubjectType: (item) => {
        return item.constructor as ExtractSubjectType<Subjects>
    }
})

      

    }

}
