import { BorrowerDto } from '@domain/dtos/borrower.dto';
import { Borrower } from '@domain/entities/borrower.entity';

export class BorrowerMapper {
  static toEntity(bookDto: BorrowerDto): Borrower {
    return new Borrower({
      id: bookDto.id,
      name: bookDto.name,
      email: bookDto.email,
      registeredAt: bookDto.registeredAt,
    });
  }

  static toDto(book: Borrower): BorrowerDto {
    return {
      id: book.id,
      name: book.name,
      email: book.email,
      registeredAt: book.registeredAt,
    };
  }
}