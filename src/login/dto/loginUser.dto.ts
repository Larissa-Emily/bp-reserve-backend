import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

}
export class LoginResponseDto {
  message: string;
  user: {
    email: string;
  };
}