import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegistroDto {
  @IsEmail({}, { message: 'Ingresá un email válido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(72, { message: 'La contraseña no puede superar los 72 caracteres' })
  password: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Ingresá un email válido' })
  email: string;

  @IsString()
  @MinLength(1, { message: 'Ingresá tu contraseña' })
  password: string;
}
