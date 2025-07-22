import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @HttpCode(200)
  @Auth()
  @Post()
  create(@CurrentUser('id') userId: string, @Body() dto: CreateCommentDto) {
    return this.commentService.create(userId, dto);
  }

  @Get('article/:articleId')
  findAllByArticle(
    @Param('articleId') articleId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('order') order: 'asc' | 'desc' = 'desc',
  ) {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    return this.commentService.findAllByArticle(articleId, pageNum, limitNum, order);
  }

  @HttpCode(200)
  @Auth()
  @Patch(':id')
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.commentService.update(userId, id, dto);
  }

  @HttpCode(200)
  @Auth()
  @Delete(':id')
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.commentService.remove(userId, id);
  }
}
