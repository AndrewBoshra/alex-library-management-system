import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrower } from '../core/entities/borrower.entity';
import { Module } from '@nestjs/common';
import {
  AddBorrower,
  AddBorrowerController,
} from './add-borrower/add-borrower';
import {
  ListBorrowers,
  ListBorrowersController,
} from './list-borrowers/list-borrowers';
import {
  UpdateBorrower,
  UpdateBorrowerController,
} from './update-borrower/update-borrower';
import {
  DeleteBorrower,
  DeleteBorrowerController,
} from './delete-borrower/delete-borrower';
import { BorrowBook, BorrowBookController } from './borrow-book/borrow-book';
import { Book } from '@core/entities/book.entity';
import { BorrowingRecord } from '../core/entities/borrowing-record.entity';
import {
  ListBorrowerBorrowingRecordsController,
  ListBorrowingRecords,
  ListBorrowingRecordsController,
} from './list-borrowing-records/list-borrowing-records';
import { ReturnBook, ReturnBookController } from './return-book/return-book';
import {
  BookBorrowingReport,
  BookBorrowingReportCSVController,
  BookBorrowingReportController,
} from './borrowing-report/borrowing-report';
import {
  ListOverDueBorrowingRecordsController,
  ListBorrowingRecordsCsv,
} from './borrowings-csv/list-borrowing-records';

@Module({
  imports: [TypeOrmModule.forFeature([Borrower, BorrowingRecord, Book])],
  controllers: [
    AddBorrowerController,
    ListBorrowersController,
    UpdateBorrowerController,
    DeleteBorrowerController,
    BorrowBookController,
    ListBorrowerBorrowingRecordsController,
    ListBorrowingRecordsController,
    ReturnBookController,
    BookBorrowingReportController,
    BookBorrowingReportCSVController,
    ListOverDueBorrowingRecordsController,
  ],
  providers: [
    AddBorrower,
    ListBorrowers,
    UpdateBorrower,
    DeleteBorrower,
    BorrowBook,
    ListBorrowingRecords,
    ReturnBook,
    BookBorrowingReport,
    ListBorrowingRecordsCsv,
  ],
})
export class BorrowingModule {}
