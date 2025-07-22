import { Module } from '@nestjs/common';
import { ArticleCategoryService } from './article_category.service';
import { ArticleCategoryController } from './article_category.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ArticleCategoryController],
  providers: [ArticleCategoryService, PrismaService],
})
export class ArticleCategoryModule {}
