import { SetMetadata } from "@nestjs/common";
import { Scope } from "src/common/enums/scope.enum";

export const SCOPES_KEY = 'scopes'
export const Scopes = (scope: Scope) =>  SetMetadata(SCOPES_KEY, scope)