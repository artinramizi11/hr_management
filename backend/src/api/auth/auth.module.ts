import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/common/db/entities/user.entity';
import { EmployeeUser } from 'src/common/db/entities/employee-user.entity';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';

@Module({
  imports:[
    JwtModule.register({
    secret:"jwt_secret_key",
    signOptions: {
      expiresIn:"1h"
    }
  }),
  TypeOrmModule.forFeature([User,EmployeeUser])
],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy,CaslAbilityFactory],
})
export class AuthModule {}
