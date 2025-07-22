import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { FileService } from 'src/file/file.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { QueryArticleDto } from './dto/query-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService, private readonly fileService: FileService) { }

  async create(authorId: string, dto: CreateArticleDto, poster?: Express.Multer.File) {
    let posterUrl: string | undefined = undefined
    if (poster) {
      try {
        const [fileResponse] = await this.fileService.saveFiles([poster], 'posters');
        posterUrl = fileResponse.url;
      } catch (e) {
        throw new BadRequestException('Ошибка при загрузке постера');
      }
    }
    return this.prisma.article.create({
      data: {
        title: dto.title,
        subtitle: dto.subtitle,
        content: dto.content,
        authorId,
        poster: posterUrl,
        categoryId: dto.categoryId,
        tags: {
          connect: dto.tagIds?.map((id) => ({ id })) || [],
        },
      },
    });
  }

  async findAll(query: QueryArticleDto) {
    const {
      page = '1',
      limit = '10',
      search,
      sort = 'desc',
      sortBy = 'date',
      categoryIds,
      tagIds,
    } = query;
    const take = parseInt(limit);
    const skip = (parseInt(page) - 1) * take;
  
    const where: Prisma.ArticleWhereInput = {
      published: true,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(categoryIds?.length && {
        categoryId: { in: categoryIds },
      }),
      ...(tagIds?.length && {
        tags: {
          some: {
            id: { in: tagIds },
          },
        },
      }),
    };
  
    const orderBy: Prisma.ArticleOrderByWithRelationInput =
      sortBy === 'likes'
        ? { likesCount: sort }
        : sortBy === 'views'
        ? { viewsCount: sort }
        : { createdAt: sort };
  
    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        take,
        skip,
        orderBy,
        include: {
          author: true,
          comments: true,
          likes: true,
          category: true,
          tags: true,
        },
      }),
      this.prisma.article.count({ where }),
    ]);
  
    return {
      data: articles,
      total,
      page: parseInt(page),
      limit: take,
    };
  }

  async getRecommendations(articleId: string, limit = 5) {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
      include: {
        tags: true,
        category: true,
      },
    });

    if (!article) {
      throw new NotFoundException('Статья не найдена');
    }

    const tagIds = article.tags.map(tag => tag.id);

    const relatedArticles = await this.prisma.article.findMany({
      where: {
        id: { not: article.id },
        published: true,
        OR: [
          { categoryId: article.categoryId },
          { tags: { some: { id: { in: tagIds } } } },
        ],
      },
      orderBy: [
        { viewsCount: 'desc' },
      ],
      take: limit,
      include: {
        author: true,
        comments: true,
        likes: true,
        category: true,
        tags: true,
      },
    });

    return relatedArticles;
  }

  async toggleLike(articleId: string, userId: string) {
    const existing = await this.prisma.like.findUnique({
      where: { userId_articleId: { userId, articleId } },
    });

    if (existing) {
      await this.prisma.like.delete({ where: { id: existing.id } });
      await this.prisma.article.update({ where: { id: articleId }, data: {likesCount: {decrement: 1}} });
      return { liked: false };
    } else {
      await this.prisma.like.create({ data: { userId, articleId } });
      await this.prisma.article.update({ where: { id: articleId }, data: {likesCount: {increment: 1}} });
      return { liked: true };
    }
  }

  async findOne(id: string) {
    const post = await this.prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          omit: {
            password: true
          }
        },
        tags: true,
      },
      omit: {
        authorId: true
      }
    });
    if (!post) {
      throw new BadRequestException('Такой статьи не существует');
    }
    await this.prisma.article.update({ where: { id }, data: {viewsCount: {increment: 1}} });
    return post;
  }

  async update(id: string, dto: UpdateArticleDto, poster?: Express.Multer.File) {
    const article = await this.findOne(id);
    if (!article) throw new NotFoundException(`Статья с id:${id} не найдена`);
    let posterUrl: string | undefined = undefined
    if (poster) {
      try {
        const [fileResponse] = await this.fileService.saveFiles([poster], 'posters');
        posterUrl = fileResponse.url;
      } catch (e) {
        throw new BadRequestException('Ошибка при загрузке постера');
      }
    }
    return this.prisma.article.update({
      where: { id },
      data: {
        title: dto.title,
        subtitle: dto.subtitle,
        content: dto.content,
        poster: posterUrl,
        categoryId: dto.categoryId,
        tags: dto.tagIds
          ? {
              set: [],
              connect: dto.tagIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: { category: true, tags: true },
    });
  }

  async remove(id: string) {
    const article = await this.findOne(id);
    if (!article) throw new NotFoundException(`Статья с id:${id} не найдена`);
    return this.prisma.article.delete({ where: { id } });
  }
}
