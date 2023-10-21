import { Author } from '@domain/entities/author.entity';
import { AuthorNotFoundException } from '@domain/exceptions/author-not-found';
import { AuthorCantBeDeletedHasBook } from '@domain/exceptions/cant-delete-author';
import { Param, Controller, Injectable, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

class DeleteAuthorCommand {
  id: number;
}

@Injectable()
export class DeleteAuthor {
  constructor(
    @InjectRepository(Author)
    private readonly authorsRepository: Repository<Author>,
  ) {}

  async execute(command: DeleteAuthorCommand) {
    const { id } = command;

    const originalAuthor = await this.authorsRepository.findOne({
      where: { id },
    });

    if (!originalAuthor) {
      throw new AuthorNotFoundException(id);
    }

    const hasBooks = await this.authorsRepository
      .createQueryBuilder('author')
      .leftJoinAndSelect('author.books', 'book')
      .where('author.id = :id', { id })
      .getCount();
    console.log('hasBooks', hasBooks);
    if (hasBooks) {
      throw new AuthorCantBeDeletedHasBook(id);
    }

    await this.authorsRepository.delete(id);
  }
}

@ApiTags('authors')
@Controller('authors')
export class DeleteAuthorController {
  constructor(private readonly addAuthor: DeleteAuthor) {}

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.addAuthor.execute({ id });
  }
}
