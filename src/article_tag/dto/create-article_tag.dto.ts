import { IsNotEmpty, IsString } from "class-validator";

export class CreateArticleTagDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}
