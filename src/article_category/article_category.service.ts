import { Injectable } from '@nestjs/common';
import { CreateArticleCategoryDto } from './dto/create-article_category.dto';
import { UpdateArticleCategoryDto } from './dto/update-article_category.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ArticleCategoryService {
  constructor(private readonly prisma: PrismaService) { }
  
  async create(createArticleCategoryDto: CreateArticleCategoryDto) {
    const category = await this.prisma.articleCategory.create({ data: createArticleCategoryDto });
    return category;
  }

  async findAll() {
    const categories = await this.prisma.articleCategory.findMany();
    return categories;
  }

  findOne(id: number) {
    return `This action returns a #${id} articleCategory`;
  }

  update(id: number, updateArticleCategoryDto: UpdateArticleCategoryDto) {
    return `This action updates a #${id} articleCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} articleCategory`;
  }
}
