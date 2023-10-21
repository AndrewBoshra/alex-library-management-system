import { IsString, IsNotEmpty, Validate, IsNumber, Min } from 'class-validator';
import { IsbnValidator } from '../validators/isbn.validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthorDto } from './author.dto';

export class BookDto {
  @ApiProperty({
    readOnly: true,
  })
  id: number;

  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsString()
  @IsNotEmpty()
  @Validate(IsbnValidator)
  isbn?: string;

  @IsNumber()
  @Min(0)
  availableQuantity?: number;

  @IsString()
  shelfLocation?: string;

  @IsNumber()
  authorId?: number;

  @ApiProperty({
    readOnly: true,
  })
  author?: AuthorDto;
}
