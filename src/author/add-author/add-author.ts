import { AuthorDto } from '@core/dtos/author.dto';
import { Author } from '@core/entities/author.entity';
import { AuthorMapper } from '@core/mappers/author.mapper';
import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AddAuthor {
  constructor(
    @InjectRepository(Author)
    private readonly authorsRepository: Repository<Author>,
  ) {}

  async execute(authorDto: AuthorDto): Promise<AuthorDto> {
    const author = this.authorsRepository.create(
      AuthorMapper.toEntity(authorDto),
    );
    const savedAuthor = await this.authorsRepository.save(author);
    return AuthorMapper.toDto(savedAuthor);
  }
}

@ApiTags('authors')
@Controller('authors')
export class AddAuthorController {
  constructor(private readonly addAuthor: AddAuthor) {}

  @Post()
  async create(@Body() author: AuthorDto) {
    return await this.addAuthor.execute(author);
  }
}
