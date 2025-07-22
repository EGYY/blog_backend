import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { PrismaService } from 'src/prisma.service';
import { FileService } from 'src/file/file.service';
import { ArticleService } from './article.service';

@Module({
  controllers: [ArticleController],
  providers: [ArticleService, PrismaService, FileService],
})
export class ArticleModule {}
