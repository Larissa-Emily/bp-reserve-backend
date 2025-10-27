import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

}
export class LoginResponseDto {
  access_token: string; // ← IMPORTANTE: access_token com underscore
  user: {
    id: number;
    name: string;
    email: string;
    sector: string;
    role: string;
  };
}