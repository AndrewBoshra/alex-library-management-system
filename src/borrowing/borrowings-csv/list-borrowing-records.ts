import { BorrowingRecord } from '@core/entities/borrowing-record.entity';
import { BorrowingRecordMapper } from '@core/mappers/borrowing-record.mapper';
import { Controller, Injectable, Get, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { createObjectCsvStringifier } from 'csv-writer';
import { Repository } from 'typeorm';

@Injectable()
export class ListBorrowingRecordsCsv {
  constructor(
    @InjectRepository(BorrowingRecord)
    private readonly borrowingRecordRepository: Repository<BorrowingRecord>,
  ) {}

  async execute({ onlyOverdue }: { onlyOverdue?: boolean }) {
    let queryBuilder = this.borrowingRecordRepository
      .createQueryBuilder('borrowingRecord')
      .leftJoinAndSelect('borrowingRecord.book', 'book')
      .leftJoinAndSelect('borrowingRecord.borrower', 'borrower')
      .orderBy('borrowingRecord.borrowedAt', 'DESC');

    console.log(await queryBuilder.getMany());
    if (onlyOverdue)
      queryBuilder = queryBuilder
        .where('borrowingRecord.returnedAt IS NULL')
        .andWhere('borrowingRecord.dueAt < :now', { now: new Date() })
        .orWhere((qb) =>
          qb
            .where('borrowingRecord.returnedAt IS NOT NULL')
            .andWhere('borrowingRecord.dueAt < borrowingRecord.returnedAt'),
        );

    const records = await queryBuilder.getMany();

    return records.map(BorrowingRecordMapper.toCSVRow);
  }
}

@ApiTags('borrowing')
@Controller('borrowing-records/reports/last-month')
export class ListOverDueBorrowingRecordsController {
  constructor(private readonly listBorrowingRecords: ListBorrowingRecordsCsv) {}

  sendCSVResponse(res, report) {
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'id', title: 'ID' },
        { id: 'dueAt', title: 'Due At' },
        { id: 'bookId', title: 'Book ID' },
        { id: 'bookTitle', title: 'Book Title' },
        { id: 'borrowerId', title: 'Borrower ID' },
        { id: 'borrowerName', title: 'Borrower Name' },
        { id: 'borrowerEmail', title: 'Borrower Email' },
        { id: 'borrowedAt', title: 'Borrowed At' },
        { id: 'returnedAt', title: 'Returned At' },
        { id: 'status', title: 'Status' },
      ],
    });

    csvStringifier.stringifyRecords(report);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=overdue-borrowings.csv',
    );
    res.send(
      csvStringifier.getHeaderString() +
        csvStringifier.stringifyRecords(report),
    );
  }
  @Get('')
  async get(@Res() res) {
    const report = await this.listBorrowingRecords.execute({
      onlyOverdue: false,
    });
    this.sendCSVResponse(res, report);
  }
  @Get('overdue')
  async getOverDue(@Res() res) {
    const report = await this.listBorrowingRecords.execute({
      onlyOverdue: true,
    });
    this.sendCSVResponse(res, report);
  }
}
