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
    const returnedLate = this.isReturned && this.returnedAt > this.dueAt;
    const notReturned = !this.isReturned && new Date() > this.dueAt;

    return returnedLate || notReturned;
  }

  get status() {
    if (this.isReturned && this.isOverdue) {
      return BorrowingRecordStatus.ReturnedOverdue;
    }

    if (this.isOverdue) {
      return BorrowingRecordStatus.Overdue;
    }

    if (this.isReturned) {
      return BorrowingRecordStatus.Returned;
    }

    return BorrowingRecordStatus.Borrowed;
  }

  get borrowingDuration() {
    if (this.isReturned) {
      return Number(this.returnedAt) - Number(this.borrowedAt);
    }
    return Number(new Date()) - Number(this.borrowedAt);
  }

  get overDueDuration() {
    if (!this.isOverdue) {
      return 0;
    }

    if (this.isReturned) {
      return Number(this.returnedAt) - Number(this.dueAt);
    }

    return Number(new Date()) - Number(this.dueAt);
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
