import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Author } from '../domain/entities/author.entity';
import { Book } from '../domain/entities/book.entity';
import { AddBook, AddBookController } from './features/add-book/add-book';
import {
  ListBooks,
  ListBooksController,
} from './features/list-books/list-books';
import {
  UpdateBook,
  UpdateBookController,
} from './features/update-book/update-book';
import {
  DeleteBook,
  DeleteBookController,
} from './features/delete-book/delete-book';

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
