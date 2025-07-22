import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { ArticleTagService } from './article_tag.service';
import { CreateArticleTagDto } from './dto/create-article_tag.dto';
import { UpdateArticleTagDto } from './dto/update-article_tag.dto';

@Controller('article-tags')
export class ArticleTagController {
  constructor(private readonly articleTagService: ArticleTagService) {}

  @Post()
  create(@Body() createArticleTagDto: CreateArticleTagDto) {
    return this.articleTagService.create(createArticleTagDto);
  }

  @HttpCode(200)
  @Get()
  findAll() {
    return this.articleTagService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleTagService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleTagDto: UpdateArticleTagDto) {
    return this.articleTagService.update(+id, updateArticleTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleTagService.remove(+id);
  }
}
