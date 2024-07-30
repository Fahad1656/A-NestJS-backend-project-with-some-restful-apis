// src/user/user.module.ts

import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module'; // Import PrismaModule
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CacheModule } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { MailModule } from 'utils/mail.module';

@Module({
  imports: [
    PrismaModule,
    MailModule

  ],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService],
})
export class UserModule {}
