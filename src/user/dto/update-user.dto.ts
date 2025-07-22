import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail({}, { message: 'Невалидный email адрес' })
  email: string;

  @IsOptional()
  @IsString()
  bio: string;
}
