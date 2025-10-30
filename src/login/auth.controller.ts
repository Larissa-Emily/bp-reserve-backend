import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRequestDto } from "./dto/auth.dto";
import { Public } from '../decorators/public.decorator'; // importa o decorator
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public() // rota publica
    @HttpCode(HttpStatus.OK)
    @Post()
    async login(@Body() authDto: AuthRequestDto) {
        return this.authService.validateUser(authDto);
    }
}
