import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateArticleDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    subtitle: string;
  
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsNotEmpty()
    categoryId: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tagIds?: string[];
}
