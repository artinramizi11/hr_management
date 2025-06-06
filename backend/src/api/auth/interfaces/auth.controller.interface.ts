import { LoginDto } from "../dto/login.dto";

export interface IAuthController {
    onLogin(loginDto: LoginDto): Promise<{message: string, token: string}>
}