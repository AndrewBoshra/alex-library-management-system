import { BaseModel } from '@/common/entity/base-model.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Book } from './book.entity';
import { BorrowingRecord } from './borrowing-record.entity';
import { AlreadyBorrowedBookException } from '@domain/exceptions/already-borrowed-book';

@Entity()
export class Borrower extends BaseModel {
  @Column()
  name: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    name: 'registered_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  registeredAt: Date;

  @OneToMany(() => BorrowingRecord, (record) => record.borrower)
  borrowingRecords?: BorrowingRecord[];

  constructor(partial: Partial<Borrower>) {
    super();
    Object.assign(this, partial);
  }

  borrowBook(book: Book, dueAt: Date) {
    const existingRecord = this.borrowingRecords.find(
      (record) => record.bookId === book.id && !record.isReturned,
    );

    if (existingRecord) {
      throw new AlreadyBorrowedBookException(book.id, existingRecord.id);
    }

    book.checkOut();

    return new BorrowingRecord({
      book,
      borrower: this,
      borrowedAt: new Date(),
      dueAt,
    });
  }
}
