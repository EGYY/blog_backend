import { Module } from '@nestjs/common';
import { ArticleTagService } from './article_tag.service';
import { ArticleTagController } from './article_tag.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ArticleTagController],
  providers: [ArticleTagService, PrismaService],
})
export class ArticleTagModule {}
