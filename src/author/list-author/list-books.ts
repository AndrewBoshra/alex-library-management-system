import { Author } from '@domain/entities/author.entity';
import { AuthorMapper } from '@domain/mappers/author.mapper';
import { QueryService } from '@common/services/query.service';
import { Controller, Injectable, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListAuthorsQuery } from './list-author-query';

@Injectable()
export class ListAuthors {
  constructor(
    @InjectRepository(Author)
    private readonly authorsRepository: Repository<Author>,
  ) {}

  async execute(query: ListAuthorsQuery) {
    const queryBuilder =
      await this.authorsRepository.createQueryBuilder('author');

    const response = await new QueryService<Author>(queryBuilder, query)
      .applyIf(!!query.name, (qb) =>
        qb.andWhere('LOWER(author.name) LIKE :name', {
          name: `%${query.name.toLowerCase()}%`,
        }),
      )

      .paginateQuery()
      .toResponse(AuthorMapper.toDto);

    return response;
  }
}

@ApiTags('authors')
@Controller('authors')
export class ListAuthorsController {
  constructor(private readonly listAuthors: ListAuthors) {}

  @Get()
  async get(@Query() query: ListAuthorsQuery) {
    return await this.listAuthors.execute(query);
  }
}
