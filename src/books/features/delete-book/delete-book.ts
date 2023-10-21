import { Book } from '@/books/entities/book.entity';
import { BookNotFoundException } from '@books/exceptions/book-not-found';
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
    });

    if (!originalBook) {
      throw new BookNotFoundException(id);
    }

    await this.booksRepository.delete(id);
  }
}

@ApiTags('books')
@Controller('books')
export class DeleteBookController {
  constructor(private readonly addBook: DeleteBook) {}

  @Delete(':id')
  async create(@Param('id') id: number) {
    return await this.addBook.execute({ id });
  }
}
