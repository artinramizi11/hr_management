import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, RelationId, Unique } from "typeorm";
import { User } from "./user.entity";
import { EmployeeUser } from "./employee-user.entity";
import { Attendance } from "./attendance.entity";

@Entity()
@Unique(['employee_user','date'])
export class Schedule {
    @PrimaryGeneratedColumn()
    id: number 

    @Column({type:"date"})
    date: Date

    @Column({type:"timestamptz"})
    starts_at: Date

    @Column({type:"timestamptz"})
    ends_at: Date

    @ManyToOne(() => EmployeeUser, {eager: true, onDelete:"CASCADE"})
    employee_user: EmployeeUser

    @RelationId((schedule: Schedule) => schedule.employee_user)
employee_user_id: number;

    @ManyToOne(() => User, {nullable: false, onDelete:"CASCADE"})
    scheduled_by: User

    @OneToOne(() => Attendance, attendance => attendance.schedule)
    attendance: Attendance







}