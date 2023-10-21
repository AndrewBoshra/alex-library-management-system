import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Author } from '../core/entities/author.entity';
import { Book } from '../core/entities/book.entity';
import { AddBook, AddBookController } from './add-book/add-book';
import { ListBooks, ListBooksController } from './list-books/list-books';
import { UpdateBook, UpdateBookController } from './update-book/update-book';
import { DeleteBook, DeleteBookController } from './delete-book/delete-book';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Author])],
  controllers: [
    AddBookController,
    ListBooksController,
    UpdateBookController,
    DeleteBookController,
  ],
  providers: [AddBook, ListBooks, UpdateBook, DeleteBook],
})
export class BooksModule {}
