import { Injectable } from '@nestjs/common';
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
    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
        const saltOrRounds = 10;
        const passwordHashed = await bcrypt.hash(createUserDto.password, saltOrRounds);

        return this.userRepository.save({
            ...createUserDto,
            password: passwordHashed,
        })
    }

    async getAllUsers(): Promise<UserEntity[]> {
        return this.userRepository.find(); // esta buscando no repository todas as funçoes
    }
}
