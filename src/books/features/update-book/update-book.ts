import { BookDto } from '@books/dtos/book.dto';
import { Author } from '@books/entities/author.entity';
import { Book } from '@books/entities/book.entity';
import { BookMapper } from '@books/mappers/book.mapper';
import { BookNotFoundException } from '@books/exceptions/book-not-found';
import { NoAuthorWithIdException } from '@books/exceptions/no-author-with-id';
import { Body, Controller, Injectable, Put, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
  constructor(private readonly addBook: UpdateBook) {}

  @Put(':id')
  async create(@Param('id') id: number, @Body() book: BookDto) {
    return await this.addBook.execute({
      id,
      bookDto: book,
    });
  }
}

class UpdateBookCommand {
  public readonly id: number;
  public readonly bookDto: BookDto;
}
