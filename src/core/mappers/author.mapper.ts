import { AuthorDto } from '@core/dtos/author.dto';
import { Author } from '@core/entities/author.entity';

export class AuthorMapper {
  static toEntity(authorDto: AuthorDto): Author {
    return new Author({
      id: authorDto.id,
      name: authorDto.name,
    });
  }

  static toDto(author: Author): AuthorDto {
    return {
      id: author.id,
      name: author.name,
    };
  }
}
