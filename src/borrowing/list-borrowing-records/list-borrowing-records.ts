import { Borrower } from '@domain/entities/borrower.entity';
import { BorrowingRecord } from '@domain/entities/borrowing-record.entity';
import { BorrowerNotFoundException } from '@domain/exceptions/borrower-not-found';
import { BorrowingRecordMapper } from '@domain/mappers/borrowing-record.mapper';
import { Controller, Injectable, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListBorrowingRecordsQuery } from './list-borrowing-records-query.dto';
import { QueryService } from '@common/services/query.service';
import { BorrowingRecordStatus } from '@domain/entities/borrowing-record-status.enum';

@Injectable()
export class ListBorrowingRecords {
  constructor(
    @InjectRepository(BorrowingRecord)
    private readonly borrowingRecordRepository: Repository<BorrowingRecord>,
    @InjectRepository(Borrower)
    private readonly borrowerRepository: Repository<Borrower>,
  ) {}

  async execute({
    borrowerId,
    query,
  }: {
    borrowerId: number;
    query: ListBorrowingRecordsQuery;
  }) {
    const queryBuilder = this.borrowingRecordRepository
      .createQueryBuilder('borrowingRecord')
      .orderBy('borrowingRecord.borrowedAt', 'DESC');

    if (borrowerId) {
      const borrower = await this.borrowerRepository.findOne({
        where: { id: borrowerId },
      });
      if (!borrower) {
        throw new BorrowerNotFoundException(borrowerId);
      }
      queryBuilder.where('borrowingRecord.borrowerId = :borrowerId', {
        borrowerId,
      });
    }

    return new QueryService<BorrowingRecord>(queryBuilder, query)
      .applyIf(!!query.bookId, (qb) =>
        qb.andWhere('borrowingRecord.bookId = :bookId', {
          bookId: query.bookId,
        }),
      )
      .applyIf(query.status === BorrowingRecordStatus.Borrowed, (qb) =>
        qb
          .andWhere('borrowingRecord.returnedAt IS NULL')
          .andWhere('borrowingRecord.dueAt > :now', { now: new Date() }),
      )
      .applyIf(query.status === BorrowingRecordStatus.Overdue, (qb) =>
        qb
          .andWhere('borrowingRecord.returnedAt IS NULL')
          .andWhere('borrowingRecord.dueAt < :now', { now: new Date() }),
      )
      .applyIf(query.status === BorrowingRecordStatus.Returned, (qb) =>
        qb.andWhere('borrowingRecord.returnedAt IS NOT NULL'),
      )
      .paginateQuery()
      .toResponse(BorrowingRecordMapper.toDto);
  }
}

@ApiTags('borrowing')
@Controller('borrowers')
export class ListBorrowerBorrowingRecordsController {
  constructor(private readonly listBorrowingRecords: ListBorrowingRecords) {}

  @Get(':borrowerId/borrowing-records')
  async get(
    @Param('borrowerId') borrowerId: number,
    @Query() query: ListBorrowingRecordsQuery,
  ) {
    return await this.listBorrowingRecords.execute({
      borrowerId,
      query,
    });
  }
}

@ApiTags('borrowing')
@Controller('borrowing-records')
export class ListBorrowingRecordsController {
  constructor(private readonly listBorrowingRecords: ListBorrowingRecords) {}

  @Get()
  async get(@Query() query: ListBorrowingRecordsQuery) {
    return await this.listBorrowingRecords.execute({
      borrowerId: null,
      query,
    });
  }
}
