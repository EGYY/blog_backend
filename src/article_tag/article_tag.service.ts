import { Injectable } from '@nestjs/common';
import { CreateArticleTagDto } from './dto/create-article_tag.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ArticleTagService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createArticleTagDto: CreateArticleTagDto) {
    const tag = await this.prisma.articleTag.create({
      data: createArticleTagDto,
    });
    return tag;
  }

  async findAll() {
    const data = await this.prisma.articleTag.findMany();
    return data;
  }

  findOne(id: number) {
    return `This action returns a #${id} articleTag`;
  }

  update(id: number) {
    return `This action updates a #${id} articleTag`;
  }

  remove(id: number) {
    return `This action removes a #${id} articleTag`;
  }
}
