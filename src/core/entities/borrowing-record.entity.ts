import { BaseModel } from '@/common/entity/base-model.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Borrower } from './borrower.entity';
import { Book } from '@core/entities/book.entity';
import { AlreadyReturnedBookException } from '@core/exceptions/already-returned-book';
import { BorrowingRecordStatus } from './borrowing-record-status.enum';

@Entity()
export class BorrowingRecord extends BaseModel {
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  borrowedAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  returnedAt: Date;

  @Column({
    type: 'timestamp',
  })
  dueAt: Date;

  @Column()
  borrowerId: number;
  @ManyToOne(() => Borrower, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    foreignKeyConstraintName: 'fk_borrowing_record_borrower',
  })
  borrower: Borrower;

  @Column()
  bookId: number;

  @ManyToOne(() => Book, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    foreignKeyConstraintName: 'fk_borrowing_record_book',
  })
  book: Book;

  get isReturned() {
    return !!this.returnedAt;
  }

  get isOverdue() {
    return this.dueAt < new Date();
  }

  get status() {
    if (this.isReturned) {
      return BorrowingRecordStatus.Returned;
    }

    if (this.isOverdue) {
      return BorrowingRecordStatus.Overdue;
    }

    return BorrowingRecordStatus.Borrowed;
  }

  return() {
    if (this.isReturned) {
      throw new AlreadyReturnedBookException(this.id);
    }
    this.returnedAt = new Date();
    this.book.return();
  }
  constructor(partial: Partial<BorrowingRecord>) {
    super();
    Object.assign(this, partial);
  }
}
