import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { FileService } from 'src/file/file.service';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    ConfigModule,
  ],
  controllers: [UserController],
  providers: [UserService, PrismaService, FileService],
})
export class UserModule {}
