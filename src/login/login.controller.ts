import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards
} from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginRequestDto } from "./dto/loginUser.dto"
import { AuthGuard } from '../authentication/auth.guard';
@Controller('login')
export class LoginController {
    constructor(private loginService: LoginService) { }

    @HttpCode(HttpStatus.OK)
    @Post()
    async login(@Body() loginDto: LoginRequestDto) {
        return this.loginService.validateUser(loginDto);
    }
    @Get('/profile')
    @UseGuards(AuthGuard)  
    getProfile(@Request() req) {
        return req.user; 
    }
}
