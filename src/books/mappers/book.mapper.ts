import { BookDto } from '../dtos/book.dto';
import { Book } from '../entities/book.entity';
import { AuthorMapper } from './author.mapper';

export class BookMapper {
  static toEntity(bookDto: BookDto): Book {
    return {
      id: bookDto.id,
      title: bookDto.title,
      isbn: bookDto.isbn,
      availableQuantity: bookDto.availableQuantity,
      shelfLocation: bookDto.shelfLocation,
      authorId: bookDto.authorId,
      author: AuthorMapper.toEntity({ id: bookDto.authorId }),
    };
  }

  static toDto(book: Book): BookDto {
    return {
      id: book.id,
      title: book.title,
      isbn: book.isbn,
      availableQuantity: book.availableQuantity,
      shelfLocation: book.shelfLocation,
      authorId: book.authorId,
      author: book?.author && AuthorMapper.toDto(book.author),
    };
  }
}
