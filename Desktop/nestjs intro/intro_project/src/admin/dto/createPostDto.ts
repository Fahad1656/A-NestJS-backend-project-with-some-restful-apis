import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class createPostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  salary: string;

  @IsNumber()
  userid: number;
}
