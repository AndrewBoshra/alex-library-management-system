import { BookDto } from '@core/dtos/book.dto';
import { Author } from '@core/entities/author.entity';
import { Book } from '@core/entities/book.entity';
import { BookMapper } from '@core/mappers/book.mapper';
import { NoAuthorWithIdException } from '@core/exceptions/no-author-with-id';
import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookWithISBNAlreadyAdded } from '@core/exceptions/book-with-isbn-added';

@Injectable()
export class AddBook {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}

  async execute(bookDto: BookDto): Promise<BookDto> {
    const author = await this.authorRepository.findOne({
      where: { id: bookDto.authorId },
    });

    if (!author) {
      throw new NoAuthorWithIdException(bookDto.authorId);
    }

    const alreadyAdded = await this.booksRepository.exist({
      where: { isbn: bookDto.isbn },
    });

    if (alreadyAdded) {
      throw new BookWithISBNAlreadyAdded(bookDto.isbn);
    }

    const book = this.booksRepository.create(BookMapper.toEntity(bookDto));
    const savedBook = await this.booksRepository.save(book);
    return BookMapper.toDto(savedBook);
  }
}

@ApiTags('books')
@Controller('books')
export class AddBookController {
  constructor(private readonly addBook: AddBook) {}

  @Post()
  async create(@Body() book: BookDto) {
    return await this.addBook.execute(book);
  }
}
