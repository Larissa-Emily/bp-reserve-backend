import { Repository } from 'typeorm';
import { UserEntity } from '../user/interface/user.entity';
import type { LoginRequestDto } from './dto/loginUser.dto';
import { JwtService } from '@nestjs/jwt';
export declare class LoginService {
    private readonly userRepository;
    private jwtService;
    constructor(userRepository: Repository<UserEntity>, jwtService: JwtService);
    validateUser(loginDto: LoginRequestDto): Promise<{
        access_token: string;
    }>;
    catch(err: unknown): void;
}
