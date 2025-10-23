import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/interface/user.entity'; 
import type { LoginRequestDto } from './dto/loginUser.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private jwtService: JwtService
    ) { }

    async validateUser(loginDto: LoginRequestDto): Promise<{ access_token: string }> {
        const { email, password } = loginDto; // ← Agora vai extrair corretamente!

        const user = await this.userRepository.findOne({
            where: { email: loginDto.email }
        });

        if (!user) {
            throw new UnauthorizedException('Usuário não encontrado');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Senha incorreta');
        }
        const payload = {
            sub: user.id,
            name: user.name,
            sector: user.sector,
            email: user.email,
            role:user.role,
        }

        return{
            access_token: await this.jwtService.signAsync(payload)
        }
    };
    catch(err: unknown) {
        console.error('Erro ao validar usuário:', err);

        // Se já é UnauthorizedException, relança
        if (err instanceof UnauthorizedException) {
            throw err;
        }

        // Outros erros
        throw new UnauthorizedException('Erro interno ao validar usuário');
    }
}
