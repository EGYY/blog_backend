import { forwardRef, Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { PrismaService } from 'src/prisma.service';
import { FileService } from 'src/file/file.service';
import { ArticleService } from './article.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    ConfigModule,
  ],
  controllers: [ArticleController],
  providers: [ArticleService, PrismaService, FileService, NotificationsService],
})
export class ArticleModule {}
