import { Book } from '@domain/entities/book.entity';
import { BookMapper } from '@domain/mappers/book.mapper';
import { QueryService } from '@common/services/query.service';
import { Controller, Injectable, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListBooksQuery } from './list-books-query.dto';

@Injectable()
export class ListBooks {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
  ) {}

  async execute(query: ListBooksQuery) {
    const queryBuilder = await this.booksRepository
      .createQueryBuilder('book')
      .innerJoinAndSelect('book.author', 'author');

    const response = await new QueryService<Book>(queryBuilder, query)
      .applyIf(!!query.title, (qb) =>
        qb.andWhere('LOWER(book.title) LIKE :title', {
          title: `%${query.title.toLowerCase()}%`,
        }),
      )
      .applyIf(!!query.authorId, (qb) =>
        qb.andWhere('book.authorId = :authorId', { authorId: query.authorId }),
      )
      .applyIf(!!query.isbn, (qb) =>
        qb.andWhere('LOWER(book.isbn) = :isbn', {
          isbn: query.isbn.toLocaleLowerCase(),
        }),
      )
      .paginateQuery()
      .toResponse(BookMapper.toDto);

    return response;
  }
}

@ApiTags('books')
@Controller('books')
export class ListBooksController {
  constructor(private readonly listBooks: ListBooks) {}

  @Get()
  async get(@Query() query: ListBooksQuery) {
    return await this.listBooks.execute(query);
  }
}
