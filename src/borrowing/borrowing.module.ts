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

@Module({
  imports: [TypeOrmModule.forFeature([Borrower])],
  controllers: [
    AddBorrowerController,
    ListBorrowersController,
    UpdateBorrowerController,
    DeleteBorrowerController,
  ],
  providers: [AddBorrower, ListBorrowers, UpdateBorrower, DeleteBorrower],
})
export class BorrowingModule {}
