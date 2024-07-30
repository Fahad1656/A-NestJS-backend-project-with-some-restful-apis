import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/auth/roles.guard';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [PrismaModule],
  controllers: [AdminController],
  exports: [AdminService],
  providers: [
    AdminService,
    RoleGuard
    
  ],
})
export class AdminModule {}
