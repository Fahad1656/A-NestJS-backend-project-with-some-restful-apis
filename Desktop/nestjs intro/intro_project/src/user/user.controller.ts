/* eslint-disable prettier/prettier */
// src/user/user.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

import { createUserDto } from './dto/createUserDto';
import { updateUserDto } from './dto/updateUserDto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(AuthGuard)
  async getProfile(@Req() res) {
    return this.userService.getprofile(res.user);
  }

  @Post('register')
  async create(@Body() userData: createUserDto) {
    return this.userService.register(userData);
  }

  @Patch('update')
  @UseGuards(AuthGuard)
  async update(@Body() userData: updateUserDto) {
    return this.userService.updateUser(userData);
  }

  @Patch('forgetPassword')
  async generateotp(@Body() email: updateUserDto) {
    return this.userService.generateOtp(email);
  }
  @Post('reset')
  async reset(@Body() data: { otp: string; password: string; email: string }) {
    const { otp, password } = data;
    return this.userService.reset(data);
  }
}
