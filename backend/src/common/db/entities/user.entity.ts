import { Role } from "src/common/enums/role.enum";
import { Scope } from "src/common/enums/scope.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number 

    @Column()
    username: string 

    @Column({nullable: true})
    pin: string
    
    @Column({type:"enum", enum:Role})
    role: Role 

      @Column({ type: 'enum', enum: Scope, default: Scope.Global })
  scope: Scope.Global;

    @CreateDateColumn({type:"timestamptz"})
    created_at: Date

}