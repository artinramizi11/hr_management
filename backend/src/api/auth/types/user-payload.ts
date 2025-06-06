import { Role } from "src/common/enums/role.enum"
import { Scope } from "src/common/enums/scope.enum"

export type UserPayload = {
 id: number,
                role: Role,
                scope: Scope
                username: string
}

