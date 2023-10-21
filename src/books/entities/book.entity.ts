import { BaseModel } from '@/common/entity/base-model.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Author } from './author.entity';

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
}
