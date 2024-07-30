import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/auth/role.enum';
import { RoleGuard } from 'src/auth/roles.guard';
import {  Roles } from 'src/auth/roles.decorator';
import { AdminService } from './admin.service';
import { createAdminDto } from './dto/createAdminDto';
import { createPostDto } from './dto/createPostDto';

@Controller('admin')
//@UseGuards(RoleGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Post('register')
  async create(
    @Body() adminData: createAdminDto,
  ) {
    return this.adminService.register(adminData);
  }
  @Post('create/userpost')
  
  @UseGuards(AuthGuard)
  async insert(
    @Body() data: createPostDto,
  ) {
    return this.adminService.insert(data);
  }
  @Get('getuser/:id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    return this.adminService.findUserById(+id);
  }

  @Get('users')
  @UseGuards(AuthGuard)

  async getAll() {
    return this.adminService.getAll();
  }
  @Patch('update/user/:id')
  @UseGuards(AuthGuard)
  async updateUser(@Body() body: any, @Param('id') id: number) {
    return this.adminService.updateUser(body, +id);
  }
  @Delete('delete/user/:id')
  @UseGuards(AuthGuard)
  async deleteUser( @Param('id') id: number) {
    return this.adminService.deleteUser(+id);
  }
}
