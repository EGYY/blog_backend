import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator, UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateArticleDto } from './dto/create-article.dto';
import { QueryArticleDto } from './dto/query-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ValidationError } from 'class-validator';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) { }

  @UsePipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    exceptionFactory: (errors: ValidationError[]) => {
      const formattedErrors = {};
      console.log(errors)
      errors.forEach((error) => {
        if (error.constraints) {
          formattedErrors[error.property] = Object.values(error.constraints)[0]; // Берем только первое сообщение
        }
      });
      console.log('formated', formattedErrors)
      return new BadRequestException({
        statusCode: 400,
        message: 'Validation failed',
        errors: formattedErrors,
      });
    },
  }))
  @HttpCode(200)
  @Auth()
  @Post()
  @UseInterceptors(FileInterceptor('poster'))
  create(
    @CurrentUser('id') userId: string,
    @Body() createPostDto: CreateArticleDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })
        ],
        fileIsRequired: false,
      }),
    )
    poster?: Express.Multer.File,
  ) {
    return this.articleService.create(userId, createPostDto, poster);
  }
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(200)
  @Get()
  findAll(@Query() query: QueryArticleDto) {
    return this.articleService.findAll(query);
  }

  @HttpCode(200)
  @Get(':id/recommendations')
  getRecommendations(@Param('id') articleId: string) {
    return this.articleService.getRecommendations(articleId);
  }

  @HttpCode(200)
  @Auth()
  @Post(':id/like')
  toggleLike(@Param('id') postId: string, @CurrentUser('id') userId: string) {
    return this.articleService.toggleLike(postId, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(id);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(200)
  @Auth()
  @Patch(':id')
  @UseInterceptors(FileInterceptor('poster'))
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() updatePostDto: UpdateArticleDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })
        ],
        fileIsRequired: false,
      }),
    )
    poster?: Express.Multer.File,
  ) {
    return this.articleService.update(id, userId, updatePostDto, poster);
  }

  @HttpCode(200)
  @Auth()
  @Delete(':id')
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.articleService.remove(id, userId);
  }
}
