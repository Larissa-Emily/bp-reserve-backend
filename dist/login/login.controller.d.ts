import { LoginService } from './login.service';
import { LoginRequestDto } from "./dto/loginUser.dto";
export declare class LoginController {
    private loginService;
    constructor(loginService: LoginService);
    login(loginDto: LoginRequestDto): Promise<{
        access_token: string;
    }>;
    getProfile(req: any): any;
}
