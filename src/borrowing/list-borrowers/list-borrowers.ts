import { QueryService } from '@common/services/query.service';
import { Borrower } from '@domain/entities/borrower.entity';
import { BorrowerMapper } from '@domain/mappers/borrower.mapper';
import { Controller, Injectable, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListBorrowerQuery } from './list-borrower-query.dto';

@Injectable()
export class ListBorrowers {
  constructor(
    @InjectRepository(Borrower)
    private readonly borrowersRepository: Repository<Borrower>,
  ) {}

  async execute(query: ListBorrowerQuery) {
    const queryBuilder = await this.borrowersRepository
      .createQueryBuilder('borrower')
      .orderBy('borrower.registeredAt', 'DESC');

    const response = await new QueryService<Borrower>(queryBuilder, query)
      .applyIf(!!query.name, (qb) =>
        qb.andWhere('LOWER(borrower.name) LIKE :name', {
          name: `%${query.name.toLowerCase()}%`,
        }),
      )
      .applyIf(!!query.email, (qb) =>
        qb.andWhere('LOWER(borrower.email) = :email', {
          email: `%${query.email.toLowerCase()}%`,
        }),
      )
      .paginateQuery()
      .toResponse(BorrowerMapper.toDto);

    return response;
  }
}

@ApiTags('borrowers')
@Controller('borrowers')
export class ListBorrowersController {
  constructor(private readonly listBorrowers: ListBorrowers) {}

  @Get()
  async get(@Query() query: ListBorrowerQuery) {
    return await this.listBorrowers.execute(query);
  }
}
