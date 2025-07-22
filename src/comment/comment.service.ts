import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) { }

  async create(userId: string, dto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: {
        content: dto.content,
        authorId: userId,
        articleId: dto.articleId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
  }

  async findAllByArticle(articleId: string, page = 1, limit = 10, order: 'asc' | 'desc' = 'desc') {
    const skip = (page - 1) * limit;
  
    const [comments, total] = await this.prisma.$transaction([
      this.prisma.comment.findMany({
        where: { articleId },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: order },
        skip,
        take: limit,
      }),
      this.prisma.comment.count({
        where: { articleId },
      }),
    ]);
  
    return {
      data: comments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(userId: string, commentId: string, dto: UpdateCommentDto) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });

    if (!comment || comment.authorId !== userId) {
      throw new NotFoundException('Комментарий не найден или у вас нет доступа для его редактирования');
    }

    return this.prisma.comment.update({
      where: { id: commentId },
      data: dto,
    });
  }

  async remove(userId: string, commentId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });

    if (!comment || comment.authorId !== userId) {
      throw new NotFoundException('Комментарий не найден или у вас нет доступа для его удаления');
    }

    return this.prisma.comment.delete({ where: { id: commentId } });
  }
}
