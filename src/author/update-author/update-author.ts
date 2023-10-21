import { AuthorDto } from '@domain/dtos/author.dto';
import { Author } from '@domain/entities/author.entity';
import { AuthorMapper } from '@domain/mappers/author.mapper';
import { AuthorNotFoundException } from '@domain/exceptions/author-not-found';
import { Body, Controller, Injectable, Put, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UpdateAuthor {
  constructor(
    @InjectRepository(Author)
    private readonly authorsRepository: Repository<Author>,
  ) {}

  async execute(command: UpdateAuthorCommand) {
    const { id, authorDto } = command;

    const originalAuthor = await this.authorsRepository.findOne({
      where: { id },
    });

    if (!originalAuthor) {
      throw new AuthorNotFoundException(id);
    }

    authorDto.id = id;
    const updatedAuthor = AuthorMapper.toEntity(authorDto);
    const savedAuthor = await this.authorsRepository.save(updatedAuthor);
    return AuthorMapper.toDto(savedAuthor);
  }
}

@ApiTags('authors')
@Controller('authors')
export class UpdateAuthorController {
  constructor(private readonly addAuthor: UpdateAuthor) {}

  @Put(':id')
  async update(@Param('id') id: number, @Body() author: AuthorDto) {
    return await this.addAuthor.execute({
      id,
      authorDto: author,
    });
  }
}

class UpdateAuthorCommand {
  public readonly id: number;
  public readonly authorDto: AuthorDto;
}
