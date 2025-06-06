import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { AppAbility, CaslAbilityFactory } from "src/casl/casl-ability.factory/casl-ability.factory";
import { PolicyHandler } from "src/casl/types/policy-handler.type";
import { CHECK_POLICIES_KEY } from "src/common/decorators/check-policies.decorator";

@Injectable()
export class PoliciesGuard implements CanActivate {

    constructor(private reflector: Reflector, private caslAbilityFactory: CaslAbilityFactory){}

    canActivate(context: ExecutionContext) {

        const policyHandlers = this.reflector.get<PolicyHandler[]>(CHECK_POLICIES_KEY, context.getHandler()) || []

        const { user } = context.switchToHttp().getRequest()

        const ability = this.caslAbilityFactory.createForUser(user)

      
    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability as AppAbility),
    );
        

    }

     private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
   
}