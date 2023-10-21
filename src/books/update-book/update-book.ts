import { BookDto } from '@core/dtos/book.dto';
import { Author } from '@core/entities/author.entity';
import { Book } from '@core/entities/book.entity';
import { BookMapper } from '@core/mappers/book.mapper';
import { BookNotFoundException } from '@core/exceptions/book-not-found';
import { NoAuthorWithIdException } from '@core/exceptions/no-author-with-id';
import { Body, Controller, Injectable, Put, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { BookWithISBNAlreadyAdded } from '@core/exceptions/book-with-isbn-added';

@Injectable()
export class UpdateBook {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}

  async execute(command: UpdateBookCommand) {
    const { id, bookDto } = command;

    const originalBook = await this.booksRepository.findOne({
      where: { id },
    });

    if (!originalBook) {
      throw new BookNotFoundException(id);
    }

    const bookWithISBNExists = await this.booksRepository.exist({
      where: { isbn: bookDto.isbn, id: Not(id) },
    });

    if (bookWithISBNExists) {
      throw new BookWithISBNAlreadyAdded(bookDto.isbn);
    }

    const author = await this.authorRepository.findOne({
      where: { id: bookDto.authorId },
    });

    if (!author) {
      throw new NoAuthorWithIdException(bookDto.authorId);
    }

    bookDto.id = id;
    const updatedBook = BookMapper.toEntity(bookDto);

    const savedBook = await this.booksRepository.save(updatedBook);
    updatedBook.author = author;
    return BookMapper.toDto(savedBook);
  }
}

@ApiTags('books')
@Controller('books')
export class UpdateBookController {
  constructor(private readonly updateBook: UpdateBook) {}

  @Put(':id')
  async update(@Param('id') id: number, @Body() book: BookDto) {
    return await this.updateBook.execute({
      id,
      bookDto: book,
    });
  }
}

class UpdateBookCommand {
  public readonly id: number;
  public readonly bookDto: BookDto;
}
