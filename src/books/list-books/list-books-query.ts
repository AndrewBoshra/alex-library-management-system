import { IsbnValidator } from '@domain/validators/isbn.validator';
import { PageOptionsDto } from '@common/dto/page-options.dto';
import { IsString, IsOptional, IsNumber, Validate } from 'class-validator';

export class ListBooksQuery extends PageOptionsDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsNumber()
  @IsOptional()
  authorId?: number;

  @IsString()
  @IsOptional()
  @Validate(IsbnValidator)
  isbn?: string;
}
