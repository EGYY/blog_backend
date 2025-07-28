import { Transform } from "class-transformer";
import { IsArray, IsOptional, IsString } from "class-validator";
import { transformToArray } from "./query-article.dto";

export class CreateArticleDto {
    @IsString({ message: 'Заголовок обязательное поле' })
    title: string;

    @IsString({ message: 'Подзаголовок обязательное поле' })
    subtitle: string;
  
    @IsString({ message: 'Текст статьи обязательное поле' })
    content: string;

    @IsString({ message: 'ID категории обязательное поле' })
    categoryId: string;

    @IsOptional()
    @Transform(transformToArray)
    @IsArray()
    @IsString({ each: true })
    tagIds?: string[];
}
