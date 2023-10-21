import { BaseModel } from '@/common/entity/base-model.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Book } from './book.entity';

@Entity()
export class Author extends BaseModel {
  @Column()
  name: string;

  @OneToMany(() => Book, (book) => book.author)
  books: Book[];

  hasBooks(): boolean {
    return this.books.length > 0;
  }

  constructor(partial: Partial<Author>) {
    super();
    Object.assign(this, partial);
  }
}
