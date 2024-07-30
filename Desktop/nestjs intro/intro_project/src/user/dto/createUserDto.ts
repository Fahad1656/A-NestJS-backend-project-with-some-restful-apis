import { IsNotEmpty, IsString } from 'class-validator';

export class createUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  age: string;

  @IsString()
  password: string;
}
