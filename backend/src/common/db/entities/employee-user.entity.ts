import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Schedule } from "./schedule.entity";
import { Scope } from "src/common/enums/scope.enum";

@Entity()
export class EmployeeUser {
    @PrimaryGeneratedColumn()
    id: number 

    @Column({unique: true})
    email: string 

    @Column()
    first_name: string 

    @Column()
    last_name: string 

    @Column({unique: true, nullable: true})
    pin: string 

    @CreateDateColumn()
    created_at: Date

    @OneToMany(() => Schedule, schedule => schedule.employee_user)
    schedules: Schedule[]


    @Column({default: Scope.Employee})
    scope: Scope.Employee




 


}