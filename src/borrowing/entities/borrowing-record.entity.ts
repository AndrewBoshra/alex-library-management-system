import { BaseModel } from '@/common/entity/base-model.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Borrower } from './borrower.entity';
import { Book } from '@books/entities/book.entity';

enum Status {
  Overdue = 'overdue',
  Returned = 'returned',
  Borrowed = 'borrowed',
}

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
      return Status.Returned;
    }

    if (this.isOverdue) {
      return Status.Overdue;
    }

    return Status.Borrowed;
  }

  constructor(partial: Partial<BorrowingRecord>) {
    super();
    Object.assign(this, partial);
  }
}
