import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { RoleGuard } from 'src/auth/roles.guard';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';
import { AdminService } from './admin/admin.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';

import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store'
import { MailService } from 'utils/mail.service';
//import { redisStore } from 'cache-manager-redis-store';
// import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    AuthModule,
    AdminModule,
    CacheModule.register({
      max: 100,
      ttl: 600000,
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: '6379',
    }),
  ],
  controllers: [AppController, AuthController, AdminController],
  providers: [
    AppService,
    AuthService,
    UserService,
    MailService,
    AdminService,
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
  //exports: [NestConfigModule],
})
export class AppModule {}
