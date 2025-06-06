import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { Schedule } from "./schedule.entity";

@Entity()
export class Attendance {
    @PrimaryGeneratedColumn()
    id: number 

    @OneToOne(() => Schedule, schedule => schedule.attendance, { cascade: true, onDelete: 'CASCADE'})
    @JoinColumn()
    schedule: Schedule;

    @Column({type:"timestamptz", nullable: true})
    entered_at: Date

    @Column({type:"timestamptz", nullable: true})
    exited_at: Date
}

