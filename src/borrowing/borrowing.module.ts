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
  ],
  providers: [
    AddBorrower,
    ListBorrowers,
    UpdateBorrower,
    DeleteBorrower,
    BorrowBook,
    ListBorrowingRecords,
    ReturnBook,
  ],
})
export class BorrowingModule {}
