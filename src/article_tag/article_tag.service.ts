import { Injectable } from '@nestjs/common';
import { CreateArticleTagDto } from './dto/create-article_tag.dto';
import { UpdateArticleTagDto } from './dto/update-article_tag.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ArticleTagService {
  constructor(private readonly prisma: PrismaService) { }
  create(createArticleTagDto: CreateArticleTagDto) {
    return 'This action adds a new articleTag';
  }

  async findAll() {
    const data = await this.prisma.articleTag.findMany();
    return data;
  }

  findOne(id: number) {
    return `This action returns a #${id} articleTag`;
  }

  update(id: number, updateArticleTagDto: UpdateArticleTagDto) {
    return `This action updates a #${id} articleTag`;
  }

  remove(id: number) {
    return `This action removes a #${id} articleTag`;
  }
}
