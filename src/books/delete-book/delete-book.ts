import { Book } from '@domain/entities/book.entity';
import { BookNotFoundException } from '@domain/exceptions/book-not-found';
import { BookCantBeDeletedIsBorrowed } from '@domain/exceptions/cant-delete-book-is-borrowed';
import { Param, Controller, Injectable, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

class DeleteBookCommand {
  id: number;
}

@Injectable()
export class DeleteBook {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
  ) {}

  async execute(command: DeleteBookCommand) {
    const { id } = command;

    const originalBook = await this.booksRepository.findOne({
      where: { id },
      relations: ['borrowingRecords'],
    });

    if (!originalBook) {
      throw new BookNotFoundException(id);
    }

    if (originalBook.isBorrowedBefore()) {
      throw new BookCantBeDeletedIsBorrowed(id);
    }
    await this.booksRepository.delete(id);
  }
}

@ApiTags('books')
@Controller('books')
export class DeleteBookController {
  constructor(private readonly addBook: DeleteBook) {}

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.addBook.execute({ id });
  }
}
