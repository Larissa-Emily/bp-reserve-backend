import {
  IsDateString,
  IsString,
  IsInt,
  Min,
  Matches,
  IsNotEmpty,
} from 'class-validator';

export class CreateReservationDto {
  @IsDateString({}, { message: 'A data deve ser uma string de data válida (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'A data é obrigatória.' })
  date: string; // Ex: "2025-12-25"

  @IsString({ message: 'O horário de início deve ser uma string' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'O horário de início deve estar no formato HH:MM',
  })
  @IsNotEmpty({ message: 'O horário de início é obrigatório.' })
  startTime: string; // Ex: "09:00"

  @IsString({ message: 'O horário de término deve ser uma string' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'O horário de término deve estar no formato HH:MM',
  })
  @IsNotEmpty({ message: 'O horário de término é obrigatório.' })
  endTime: string; // Ex: "10:00"

  @IsInt({ message: 'O ID da sala deve ser um número inteiro' })
  @Min(1, { message: 'O ID da sala deve ser maior que 0' })
  @IsNotEmpty({ message: 'O ID da sala é obrigatório.' })
  roomId: number;

  // Mesmo que o userId venha do token, mantemos aqui para segurança no backend
  @IsInt({ message: 'O ID do usuário deve ser um número inteiro' })
  @Min(1, { message: 'O ID do usuário deve ser maior que 0' })
  @IsNotEmpty({ message: 'O ID do usuário é obrigatório.' })
  userId: number;
}
