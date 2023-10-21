import { BaseModel } from '@/common/entity/base-model.entity';
import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Author } from './author.entity';
import { NoAvailableBookException } from '@domain/exceptions/no-available-book';
import { BorrowingRecord } from './borrowing-record.entity';

@Entity()
export class Book extends BaseModel {
  @Column()
  title: string;

  @Column()
  isbn: string;

  @Column()
  availableQuantity: number;

  @Column()
  shelfLocation: string;

  @Column()
  authorId: number;

  @ManyToOne(() => Author, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    foreignKeyConstraintName: 'fk_book_author',
  })
  author?: Author;

  @OneToMany(() => BorrowingRecord, (borrowingRecord) => borrowingRecord.book)
  borrowingRecords?: BorrowingRecord[];

  checkOut() {
    if (this.availableQuantity === 0) {
      throw new NoAvailableBookException(this.id);
    }

    this.availableQuantity -= 1;
  }

  return() {
    this.availableQuantity += 1;
  }

  isBorrowedBefore() {
    return Boolean(this.borrowingRecords.length);
  }

  constructor(partial: Partial<Book>) {
    super();
    Object.assign(this, partial);
  }
}
