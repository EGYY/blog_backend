import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsNumberString, IsEnum, IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';

export enum SortOrder {
  asc = 'asc',
  desc = 'desc',
}

export enum SortBy {
  date = 'date',
  likes = 'likes',
  views = 'views'
}

const transformToArray = ({ value }) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return value.split(',').map((v) => v.trim());
  return [];
};


export class QueryArticleDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(SortOrder)
  sort?: SortOrder;

  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy;

  @IsOptional()
  @Transform(transformToArray)
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];

  @IsOptional()
  @Transform(transformToArray)
  @IsArray()
  @IsString({ each: true })
  tagIds?: string[];
}
