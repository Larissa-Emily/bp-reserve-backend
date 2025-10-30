import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserEntity } from './interface/user.entity';

describe('UserController', () => {
    let controller: UserController;
    let service: UserService;

    // 🔧 Mock do UserService
    const mockUserService = {
        getAllUsers: jest.fn(),
        getUser: jest.fn(),
        createUser: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                { provide: UserService, useValue: mockUserService },
            ],
        }).compile();

        controller = module.get<UserController>(UserController);
        service = module.get<UserService>(UserService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('deve estar definido', () => {
        expect(controller).toBeDefined();
    });

    it('deve retornar todos os usuários', async () => {
        const users: UserEntity[] = [{ id: 1, name: 'João', email: 'j@j.com' } as UserEntity];
        mockUserService.getAllUsers.mockResolvedValue(users);

        const result = await controller.getAllUsers();
        expect(result).toEqual(users);
        expect(service.getAllUsers).toHaveBeenCalled();
    });

    it('deve retornar um usuário por ID', async () => {
        const user = { id: 1, name: 'Maria' } as UserEntity;
        mockUserService.getUser.mockResolvedValue(user);

        const result = await controller.getUser('1');
        expect(result).toEqual(user);
        expect(service.getUser).toHaveBeenCalledWith(1);
    });

    it('deve criar um usuário', async () => {
        const dto: CreateUserDto = {
            name: 'Novo',
            email: 'novo@ex.com',
            password: '123',
            sector: 'TI',
            functionUser: 'Developer',
            phone: '11999999999',
            role: 'user', // ou roles: ['user']
        };
        const createdUser = { id: 1, ...dto } as UserEntity;

        mockUserService.createUser.mockResolvedValue(createdUser);

        const result = await controller.createUser(dto);
        expect(result).toEqual(createdUser);
        expect(service.createUser).toHaveBeenCalledWith(dto);
    });

    it('deve atualizar um usuário', async () => {
        const dto: UpdateUserDto = { name: 'Atualizado' };
        const updated = { id: 1, ...dto } as UserEntity;

        mockUserService.update.mockResolvedValue(updated);

        const result = await controller.update(1, dto);
        expect(result).toEqual(updated);
        expect(service.update).toHaveBeenCalledWith(1, dto);
    });

    it('deve remover um usuário', async () => {
        mockUserService.remove.mockResolvedValue(undefined);

        await controller.remove(1);
        expect(service.remove).toHaveBeenCalledWith(1);
    });
});
