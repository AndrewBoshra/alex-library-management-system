import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Author } from '../domain/entities/author.entity';
import { AddAuthor, AddAuthorController } from './add-author/add-author';
import {
  ListAuthors,
  ListAuthorsController,
} from './list-authors/list-authors';
import {
  UpdateAuthor,
  UpdateAuthorController,
} from './update-author/update-author';
import {
  DeleteAuthor,
  DeleteAuthorController,
} from './delete-author/delete-author';

@Module({
  imports: [TypeOrmModule.forFeature([Author])],
  controllers: [
    AddAuthorController,
    ListAuthorsController,
    UpdateAuthorController,
    DeleteAuthorController,
  ],
  providers: [AddAuthor, ListAuthors, UpdateAuthor, DeleteAuthor],
})
export class AuthorsModule {}
