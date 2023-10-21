import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrower } from './entities/borrower.entity';
import { Module } from '@nestjs/common';
import {
  AddBorrower,
  AddBorrowerController,
} from './features/add-borrower/add-borrower';
import {
  ListBorrowers,
  ListBorrowersController,
} from './features/list-borrowers/list-borrowers';
import {
  UpdateBorrower,
  UpdateBorrowerController,
} from './features/update-borrower/update-borrower';
import {
  DeleteBorrower,
  DeleteBorrowerController,
} from './features/delete-borrower/delete-borrower';
import {
  BorrowBook,
  BorrowBookController,
} from './features/borrow-book/borrow-book';
import { Book } from '@books/entities/book.entity';
import { BorrowingRecord } from './entities/borrowing-record.entity';
import {
  ListBorrowingRecords,
  ListBorrowingRecordsController,
} from './features/list-borrowing-records/list-borrowing-records';

@Module({
  imports: [TypeOrmModule.forFeature([Borrower, BorrowingRecord, Book])],
  controllers: [
    AddBorrowerController,
    ListBorrowersController,
    UpdateBorrowerController,
    DeleteBorrowerController,
    BorrowBookController,
    ListBorrowingRecordsController,
  ],
  providers: [
    AddBorrower,
    ListBorrowers,
    UpdateBorrower,
    DeleteBorrower,
    BorrowBook,
    ListBorrowingRecords,
  ],
})
export class BorrowingModule {}
