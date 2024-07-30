// src/user/user.service.ts

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import { MailService } from 'utils/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { createUserDto } from './dto/createUserDto';
import { updateUserDto } from './dto/updateUserDto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getprofile(user: any) {
    //return this.prisma.user.findMany();

    return {
      status: 'success',
      message: 'Here is the details',
      user: user,
    };
  }

  async register(data: createUserDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    console.log(hashedPassword);
    return this.prisma.user.create({
      data,
    });
  }

  async updateUser(data: updateUserDto) {
    // Check if user exists before attempting to update
    console.log(data);
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with email ${data.email} not found.`);
    } else {
      if (!data.password) {
        const updatedInfo = await this.prisma.user.update({
          where: { email: data.email },
          data,
        });
        if (updatedInfo) {
          return {
            status: 'success',
            message: 'updated the information successfully',
            data: data,
          };
        } else {
          return {
            status: 'unsuccessful',
            message: 'cant not update the information',
            data: data,
          };
        }
      } else {
        throw new NotFoundException(`password  Can't be changed.`);
      }
    }
  }
  async generateOtp(email: updateUserDto) {
    // Check if user exists
    console.log(email);
    const existingUser = await this.prisma.user.findUnique({
      where: { email: email.email }, // Corrected syntax: where: { email: email }
    });

    if (!existingUser) {
      throw new NotFoundException(`User with email ${email} not found.`);
    }

    function generateRandomNumber(): number {
      return Math.floor(100000 + Math.random() * 900000);
    }

    const otpNumber = generateRandomNumber();
    console.log(otpNumber);

    // Save OTP to cache
    await this.cacheManager.set('otp', otpNumber.toString());

    // Send email with OTP
    try {
      this.mailService.sendEmail(email.email, otpNumber.toString());
      console.log('Email sent successfully');
    } catch (error) {
      console.log('Error sending email:', error);
      throw new Error('Failed to send email');
    }

    return {
      status: 'success',
      otp: otpNumber.toString(),
    };
  }
  async reset(data: {
    otp: string;
    password: string;
    email: string;
  }): Promise<{ status: string; message: string }> {
    const { otp, password, email } = data;

    try {
      // Retrieve OTP from cache
      const otpCodeFromCache = await this.cacheManager.get('otp');

      // Verify OTP
      if (!otpCodeFromCache || otp !== otpCodeFromCache) {
        throw new NotFoundException('Invalid OTP. Password reset failed.');
      }

      // Generate hashed password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update user's password
      const updatedUser = await this.prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
        },
      });

      if (!updatedUser) {
        throw new NotFoundException(
          `User with email ${email} not found. Password reset failed.`,
        );
      }

      // Clear OTP from cache after successful reset (optional)
      await this.cacheManager.del('otp');

      return {
        status: 'success',
        message: 'Password reset successful',
      };
    } catch (error) {
      throw new Error(`Password reset failed: ${error.message}`);
    }
  }
}
