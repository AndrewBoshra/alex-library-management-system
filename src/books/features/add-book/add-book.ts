import { BookDto } from '@/books/dtos/book.dto';
import { Author } from '@/books/entities/author.entity';
import { Book } from '@/books/entities/book.entity';
import { BookMapper } from '@/books/mappers/book.mapper';
import { NoAuthorWithIdException } from '@books/exceptions/no-author-with-id';
import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
