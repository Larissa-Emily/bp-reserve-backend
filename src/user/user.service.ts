import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from './interface/user.entity';
import type { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) { }
    // Metodo para ser reutilizavel
    async getUserById(id: number): Promise<UserEntity> {
        const user = await this.userRepository.findOne({ where: { id } });

        if (!user) {
            throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
        }

        return user;

    }
    //Rota Get - pegar todos os usuarios
    async getAllUsers(): Promise<UserEntity[]> {
        return this.userRepository.find(); // esta buscando no repository todas as funçoes
    }

    // Rota Post - criar novos usuarios
    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
        const saltOrRounds = 10;
        const passwordHashed = await bcrypt.hash(createUserDto.password, saltOrRounds);
        return this.userRepository.save({
            ...createUserDto,
            password: passwordHashed,
        })
    }
    //rota Delete - remover um usuario por id
    async remove(id: number): Promise<{ message: string }> {
        const user = await this.getUserById(id); // ← Chama o método

        await this.userRepository.remove(user);
        return { message: `Usuário ${user.name} foi deletado com sucesso` };
    }

}
