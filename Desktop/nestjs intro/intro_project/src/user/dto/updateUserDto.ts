import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class updateUserDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsNotEmpty()

  @IsString()
  email: string;

  @IsOptional()
  age: string;

  @IsOptional()
  password: string;
}