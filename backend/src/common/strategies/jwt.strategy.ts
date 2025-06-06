import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Scope } from "src/common/enums/scope.enum";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/common/db/entities/user.entity";
import { Repository } from "typeorm";
import { EmployeeUser } from "src/common/db/entities/employee-user.entity";
import { ConfigService } from "@nestjs/config";
import { UserPayload } from "src/api/auth/types/user-payload";
import { EmployeeUserPayload } from "src/api/auth/types/employee-payload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(EmployeeUser) private employeeRepo: Repository<EmployeeUser>,
        private configService: ConfigService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get("jwt").secret_key,
        })
    }

    

   async validate(payload: UserPayload | EmployeeUserPayload) {

    const { id , scope } = payload

        if(scope === Scope.Global){
            const userExits = await this.userRepo.findOneBy({id: id})
            if(userExits){
                return payload
            }
            throw new UnauthorizedException("Jwt verification failed, no user found by this id")
        }

        if(scope === Scope.Employee){
            const userExists = await this.employeeRepo.findOneBy({id: id})
            if(userExists){
                return payload
            }
            throw new UnauthorizedException("Jwt verification failed, no user found by this id")
        }
    }
}