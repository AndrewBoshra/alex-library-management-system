import { Book } from '@core/entities/book.entity';
import { BorrowingReportCalculator } from '@core/entities/borrowing-report-calculator';
import { Controller, Injectable, Get, Res, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createObjectCsvStringifier } from 'csv-writer';
import { DurationQuery } from './duration-query.dto';

@Injectable()
export class BookBorrowingReport {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
  ) {}

  async execute(duration: DurationQuery) {
    const queryBuilder = await this.booksRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.borrowingRecords', 'borrowingRecords')
      .leftJoinAndSelect('book.author', 'author')
      .orderBy('book.title', 'ASC');

    if (duration.startDateTime) {
      queryBuilder.andWhere('borrowingRecords.borrowedAt >= :startDateTime', {
        startDateTime: duration.startDateTime,
      });
    }

    if (duration.endDateTime) {
      queryBuilder.andWhere('borrowingRecords.borrowedAt <= :endDateTime', {
        endDateTime: duration.endDateTime,
      });
    }

    queryBuilder.orWhere('borrowingRecords.borrowedAt IS NULL');

    const books = await queryBuilder.getMany();

    return books.map(BorrowingReportCalculator.calculate);
  }
}

@ApiTags('borrowing-report')
@Controller('borrowing-report')
export class BookBorrowingReportController {
  constructor(private readonly borrowingReport: BookBorrowingReport) {}

  @Get()
  async get(@Query() duration: DurationQuery) {
    return await this.borrowingReport.execute(duration);
  }
}

@ApiTags('borrowing-report')
@Controller('borrowing-report/export-csv')
export class BookBorrowingReportCSVController {
  constructor(private readonly borrowingReport: BookBorrowingReport) {}

  @Get()
  async get(@Query() duration: DurationQuery, @Res() res) {
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'id', title: 'ID' },
        { id: 'title', title: 'Title' },
        { id: 'isbn', title: 'ISBN' },
        { id: 'availableQuantity', title: 'Available Quantity' },
        { id: 'shelfLocation', title: 'Shelf Location' },
        { id: 'authorId', title: 'Author ID' },
        { id: 'authorName', title: 'Author Name' },
        { id: 'borrowedCount', title: 'Borrowed Count' },
        { id: 'returnedInTimeCount', title: 'Returned In Time Count' },
        { id: 'notReturnedYetCount', title: 'Not Returned Yet Count' },
        { id: 'returnedOverDueCount', title: 'Returned Over Due Count' },
        { id: 'notReturnedOverDueCount', title: 'Not Returned Over Due Count' },
        { id: 'avgOverdueDuration', title: 'Avg Overdue Duration (Min)' },
        { id: 'avgBorrowingDuration', title: 'Avg Borrowing Duration (Min)' },
      ],
    });

    const report = await this.borrowingReport.execute(duration);

    csvStringifier.stringifyRecords(report);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=report.csv');
    res.send(
      csvStringifier.getHeaderString() +
        csvStringifier.stringifyRecords(report),
    );
  }
}
