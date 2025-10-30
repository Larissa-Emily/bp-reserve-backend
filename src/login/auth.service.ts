import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/interface/user.entity';
import type { AuthRequestDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) { }

  private readonly MAX_ATTEMPTS = 3;
  private readonly LOCK_TIME_MS = 10 * 60 * 1000; // 10 minutos

  async validateUser(authDto: AuthRequestDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: authDto.email },
      });

      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      // 1️⃣ Verifica se a conta está bloqueada
      if (user.lock_until && user.lock_until > new Date()) {
        const timeLeft = Math.ceil((user.lock_until.getTime() - Date.now()) / 1000 / 60);
        throw new UnauthorizedException(
          `Conta bloqueada. Aguarde ${timeLeft} minuto(s) para tentar novamente.`,
        );
      }

      // 2️⃣ Compara senha recebida com a salva
      const isPasswordValid = await bcrypt.compare(authDto.password, user.password);

      if (!isPasswordValid) {
        // Incrementa tentativas
        user.failed_attempts = (user.failed_attempts || 0) + 1;

        // Bloqueia se atingiu limite
        if (user.failed_attempts >= this.MAX_ATTEMPTS) {
          user.lock_until = new Date(Date.now() + this.LOCK_TIME_MS);
          user.failed_attempts = 0; // reseta contador
          await this.userRepository.save(user);

          throw new UnauthorizedException(
            `Muitas tentativas incorretas. Conta bloqueada por ${this.LOCK_TIME_MS / 60000} minutos.`,
          );
        }

        // Atualiza contador sem bloquear ainda
        await this.userRepository.save(user);
        throw new UnauthorizedException('Senha incorreta');
      }

      // 3️⃣ Se senha correta, zera tentativas e desbloqueia
      if (user.failed_attempts > 0 || user.lock_until) {
        user.failed_attempts = 0;
        user.lock_until = null;
        await this.userRepository.save(user);
      }

      // 4️⃣ Gera token JWT
      const payload = {
        sub: user.id,
        name: user.name,
        sector: user.sector,
        functionUser: user.functionUser,
        phone: user.phone,
        email: user.email,
        role: user.role,
      };

      return {
        access_token: await this.jwtService.signAsync(payload),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          sector: user.sector,
          role: user.role,
          functionUser: user.functionUser,
          phone: user.phone,
        },
      };
    } catch (err: unknown) {
      if (err instanceof UnauthorizedException || err instanceof BadRequestException) {
        throw err;
      }
      throw new UnauthorizedException('Erro interno ao validar usuário');
    }
  }
}
