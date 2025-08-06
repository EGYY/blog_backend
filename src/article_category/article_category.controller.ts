import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ArticleCategoryService } from './article_category.service';
import { CreateArticleCategoryDto } from './dto/create-article_category.dto';

@Controller('article-categories')
export class ArticleCategoryController {
  constructor(
    private readonly articleCategoryService: ArticleCategoryService,
  ) {}

  @Post()
  create(@Body() createArticleCategoryDto: CreateArticleCategoryDto) {
    return this.articleCategoryService.create(createArticleCategoryDto);
  }

  @HttpCode(200)
  @Get()
  findAll() {
    return this.articleCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleCategoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.articleCategoryService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleCategoryService.remove(+id);
  }
}
