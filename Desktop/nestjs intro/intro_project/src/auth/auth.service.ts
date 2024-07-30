import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';
import { AdminService } from 'src/admin/admin.service';
import { loginUserDto } from './dto/LoginUserDto';
import { LoginAdminDto } from './dto/LoginAdminDto';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private adminService: AdminService,
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async userlogin(data:loginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (user) {
      const passwordMatch = await bcrypt.compare(data.password, user.password);
      console.log(passwordMatch);
      if (passwordMatch) {
        const access_token = await this.jwtService.signAsync(user);
        return {
          status: 'success',
          message: 'Logged In  successfully',
          data: {
            id: user.id,
            email: user.email,
            name: user.name,
            // Add other fields you want to include in the response
          },
          token: access_token,
        };
      } else {
        return {
          status: 'fail',
          message: 'password not correct',
        };
      }
    }
  }
  async adminlogin(data: LoginAdminDto) {
    const admin = await this.prisma.admin.findUnique({
      where: {
        email: data.email,
      },
    });

    if (admin) {
      const passwordMatch = await bcrypt.compare(data.password, admin.password);
      console.log(passwordMatch);
      if (passwordMatch) {
        const access_token = await this.jwtService.signAsync(admin);
        return {
          status: 'success',
          message: 'Logged In  successfully',
          data: {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            // Add other fields you want to include in the response
          },
          token: access_token,
        };
      } else {
        return {
          status: 'fail',
          message: 'password not correct',
        };
      }
    }
  }
}
