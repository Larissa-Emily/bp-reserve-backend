import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginRequestDto } from "./dto/loginUser.dto";
import { Public } from '../decorators/public.decorator'; // importa o decorator
import { Roles } from 'src/decorators/roles.decorator';
@Controller('login')
export class LoginController {
    constructor(private loginService: LoginService) { }

    @Public() // rota publica
    @HttpCode(HttpStatus.OK)
    @Post()
    async login(@Body() loginDto: LoginRequestDto) {
        return this.loginService.validateUser(loginDto);
    }

    //  rota  protegida
    @Roles("manager")
    @Get('/profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
