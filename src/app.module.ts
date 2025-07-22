
import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import { AuthModule } from './auth/auth.module';
import { ArticleModule } from './article/article.module';
import { CommentModule } from './comment/comment.module';
import { ArticleCategoryModule } from './article_category/article_category.module';
import { ArticleTagModule } from './article_tag/article_tag.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    FileModule,
    ArticleModule,
    CommentModule,
    ArticleCategoryModule,
    ArticleTagModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
