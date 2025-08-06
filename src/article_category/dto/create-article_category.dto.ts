import { IsNotEmpty, IsString } from 'class-validator';

export class CreateArticleCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
