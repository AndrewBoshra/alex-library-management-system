import { Book } from '@core/entities/book.entity';
import { BorrowingReportCalculator } from '@core/entities/borrowing-report-calculator';
import { Controller, Injectable, Get, StreamableFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createObjectCsvWriter } from 'csv-writer';
import { createReadStream } from 'fs';

@Injectable()
export class BookBorrowingReport {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
  ) {}

  async execute() {
    const queryBuilder = await this.booksRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.borrowingRecords', 'borrowingRecords')
      .leftJoinAndSelect('book.author', 'author')
      .orderBy('book.title', 'ASC');

    const books = await queryBuilder.getMany();

    return books.map(BorrowingReportCalculator.calculate);
  }
}

@ApiTags('borrowing-report')
@Controller('borrowing-report')
export class BookBorrowingReportController {
  constructor(private readonly borrowingReport: BookBorrowingReport) {}

  @Get()
  async get() {
    return await this.borrowingReport.execute();
  }
}

@ApiTags('borrowing-report')
@Controller('borrowing-report/export-csv')
export class BookBorrowingReportCSVController {
  constructor(private readonly borrowingReport: BookBorrowingReport) {}

  @Get()
  async get() {
    const csvWriter = createObjectCsvWriter({
      path: 'books.csv',
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

    const report = await this.borrowingReport.execute();

    await csvWriter.writeRecords(report);

    const file = createReadStream('books.csv');

    return new StreamableFile(file, {
      disposition: 'attachment; filename=books.csv',
    });
  }
}
