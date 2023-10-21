import { BaseModel } from '@/common/entity/base-model.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Author } from './author.entity';
import { NoAvailableBookException } from '@domain/exceptions/no-available-book';

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

  checkOut() {
    if (this.availableQuantity === 0) {
      throw new NoAvailableBookException(this.id);
    }

    this.availableQuantity -= 1;
  }

  return() {
    this.availableQuantity += 1;
  }

  constructor(partial: Partial<Book>) {
    super();
    Object.assign(this, partial);
  }
}
