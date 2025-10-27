import { LoginService } from './login.service';
import { LoginRequestDto } from "./dto/loginUser.dto";
export declare class LoginController {
    private loginService;
    constructor(loginService: LoginService);
    login(loginDto: LoginRequestDto): Promise<{
        access_token: string;
        user: {
            id: number;
            name: string;
            email: string;
            sector: string;
            role: string;
        };
    }>;
    getProfile(req: any): any;
}
