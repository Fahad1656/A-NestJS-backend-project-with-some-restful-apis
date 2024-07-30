import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AdminService } from 'src/admin/admin.service';
import { AuthService } from './auth.service';
import { Roles } from './roles.decorator';
import { Role } from './role.enum';
import { LoginAdminDto } from './dto/LoginAdminDto';
import { loginUserDto } from './dto/LoginUserDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('user/login')
  @HttpCode(HttpStatus.OK)
  async fetch(@Body() data: loginUserDto) {
    return this.authService.userlogin(data);
  }
  @Post('admin/login')
 
  @HttpCode(HttpStatus.OK)
  async f(@Body() data: LoginAdminDto) {
    return this.authService.adminlogin(data);
  }
}
