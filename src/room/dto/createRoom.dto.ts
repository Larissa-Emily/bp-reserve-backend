import { IsString, IsInt, IsOptional, IsBoolean, MinLength, MaxLength, Min } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @MinLength(3, { message: 'O nome deve ter no mínimo 3 caracteres' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  name!: string;

  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'A descrição deve ter no máximo 255 caracteres' })
  description?: string;

  @IsInt({ message: 'A capacidade deve ser um número inteiro' })
  @Min(1, { message: 'A capacidade deve ser no mínimo 1' })
  capacity!: number;

  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'A localização deve ter no máximo 50 caracteres' })
  location?: string;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
