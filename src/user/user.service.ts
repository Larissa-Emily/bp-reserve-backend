import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { UserEntity } from './interface/user.entity';
import type { CreateUserDto } from './dto/createUser.dto';
import type { UpdateUserDto } from './dto/updateUser.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReserveEntity } from '../reserve/interface/reserve.entity';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name); // Adicione o logger
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(ReserveEntity)
        private readonly reserveRepository: Repository<ReserveEntity>,
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
        return this.userRepository.find();
    }
    async getUser(id: number): Promise<UserEntity> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`Erro ao buscar usuario: ${id}`)
        }
        return user;
    }


    // Rota Post - criar novos usuarios
    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
        const saltOrRounds = 10;
        const passwordHashed = await bcrypt.hash(createUserDto.password, saltOrRounds);
        return this.userRepository.save({
            ...createUserDto,
            password: passwordHashed,
        });
    }

    // rota de update - atualizar os dados por id 
    async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
        this.logger.log(`Tentativa de atualizar usuário com ID: ${id}`);
        this.logger.log(`Dados recebidos para atualização: ${JSON.stringify(updateUserDto)}`);

        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            this.logger.warn(`Usuário com ID ${id} não encontrado.`);
            throw new NotFoundException(`Usuário com o ID ${id} não encontrado.`);
        }

        Object.assign(user, updateUserDto);
        this.logger.log(`Objeto do usuário mesclado, pronto para salvar.`);
        const updatedUser = await this.userRepository.save(user);
        this.logger.log(`Usuário com ID ${updatedUser.id} salvo com sucesso.`);

        return updatedUser;
    }

    //rota Delete - remover um usuario por id 
    async remove(id: number): Promise<{ message: string }> {
        const user = await this.getUserById(id); // ← Chama o método
        if (!user) {
            throw new NotFoundException("Usuario não encontrado!")
        }

        // Aqui deleta todas as reservas do usuario deletado
        await this.reserveRepository.delete({ user: { id } })

        // Aqui deleta o usuario
        await this.userRepository.remove(user);
        return { message: `Usuário ${user.name} foi deletado com sucesso` };
    }
}
