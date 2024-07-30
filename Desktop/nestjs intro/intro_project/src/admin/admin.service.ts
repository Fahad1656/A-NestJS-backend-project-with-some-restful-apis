import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import * as bcrypt from 'bcrypt';
import { title } from 'process';
import { createAdminDto } from './dto/createAdminDto';
import { createPostDto } from './dto/createPostDto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async register(admindata: createAdminDto) {
    const hashedPassword = await bcrypt.hash(admindata.password, 10);

    const data = {
      name: admindata.name,
      email: admindata.email,
      password: hashedPassword,
    };

    console.log(hashedPassword); // Optional: Logging the hashed password

    return this.prisma.admin.create({
      data,
    });
  }
  async insert(data: createPostDto) {
    const { title, salary, userid } = data; // Destructure the data object if needed

    const createdPost = await this.prisma.post.create({
      data: {
        title,
        salary,
        user: { connect: { id: userid } },
      },
    });
  }
  async findUserById(userId: number) {
    //console.log(userId, 'fahad');
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        posts: true, // Assuming 'posts' is the relation name in the User model
      },
    });
    console.log(user);
    if (!user) {
      throw new NotFoundException(` The User ${userId} not found.`);
    } else {
      return {
        status: 'Succcessfull',
        message: 'Here is the info by id',
        user: user,
      };
    }
  }
  async getAll() {
    //console.log("dfgvb")
    const users = await this.prisma.user.findMany({
      include: {
        posts: true, // Assuming 'posts' is the relation name in the User model
      },
    });
    // console.log(users);
    if (!users) {
      throw new NotFoundException(` Users not found.`);
    } else {
      return {
        status: 'Succcessfull',
        message: 'Here you can see all users',
        users: users,
      };
    }
  }
  async deleteUser(id: number) {
    console.log(id);

    try {
      const deleteUser = await this.prisma.user.delete({
        where: { id: id },
      });

      return {
        status: 'successful',
        message: `Deleted the user and their posts`,
        user: deleteUser,
      };
    } catch (error) {
      throw new NotFoundException(`User with ID ${id} cannot be deleted`);
    }
  }
  async updateUser(payload: any, id: number) {
    console.log(id);
    console.log(payload);

    const updatedUser = await this.prisma.post.update({
      where: { id: id },
      data: payload,
    });
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      include: {
        posts: true,
      },
    });
    if (!updatedUser) {
      throw new NotFoundException(`the user cant be updated`);
    } else {
      return {
        status: 'succesfull',
        message: `updated the info`,
        user: user,
      };
    }
  }
}
