import { IsString, IsEmail, IsNotEmpty } from "class-validator"; 

export class CreateUserDto {
  @IsString({ message: 'O nome deve ser uma string.' }) 
  @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
  name!: string;

  @IsString({ message: 'O setor deve ser uma string.' })
  @IsNotEmpty({ message: 'O setor não pode ser vazio.' })
  sector!: string;

  @IsString({ message: 'A função deve ser uma string.' })
  @IsNotEmpty({ message: 'A função não pode ser vazia.' })
  functionUser!: string; 

  @IsString({ message: 'O telefone deve ser uma string.' })
  @IsNotEmpty({ message: 'O telefone não pode ser vazio.' })
  phone!: string;

  @IsEmail({}, { message: 'O email deve ser um endereço de email válido.' })
  @IsNotEmpty({ message: 'O email não pode ser vazio.' })
  email!: string;

  @IsString({ message: 'A senha deve ser uma string.' })
  @IsNotEmpty({ message: 'A senha não pode ser vazia.' })
  password!: string;

  @IsString({ message: 'A role deve ser uma string.' })
  @IsNotEmpty({ message: 'A role não pode ser vazia.' })
  role!: string;
}
