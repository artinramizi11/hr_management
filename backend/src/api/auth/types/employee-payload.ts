import { Scope } from "src/common/enums/scope.enum"

export type EmployeeUserPayload = {
id: number 
scope: Scope
email: string
}