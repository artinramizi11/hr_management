import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { EmployeeUser } from 'src/common/db/entities/employee-user.entity';
import { User } from 'src/common/db/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User,EmployeeUser])],
  controllers: [UserController],
  providers: [UserService,CaslAbilityFactory],
})
export class UserModule {}
