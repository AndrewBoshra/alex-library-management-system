import { BookDto } from '@/books/dtos/book.dto';
import { Book } from '@/books/entities/book.entity';
import { BookMapper } from '@/books/mappers/book.mapper';
import { Controller, Injectable, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ListBooks {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
  ) {}

  async execute(): Promise<BookDto[]> {
    const bks = await this.booksRepository.find();
    return bks.map(BookMapper.toDto);
  }
}

@ApiTags('books')
@Controller('books')
export class ListBooksController {
  constructor(private readonly listBooks: ListBooks) {}

  @Get()
  async create() {
    return await this.listBooks.execute();
  }
}
