import { AuthorDto } from '@domain/dtos/author.dto';
import { Author } from '@domain/entities/author.entity';

export class AuthorMapper {
  static toEntity(authorDto: AuthorDto): Author {
    return {
      id: authorDto.id,
      name: authorDto.name,
    };
  }

  static toDto(author: Author): AuthorDto {
    return {
      id: author.id,
      name: author.name,
    };
  }
}
