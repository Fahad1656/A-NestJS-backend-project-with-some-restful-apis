import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class createAdminDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
