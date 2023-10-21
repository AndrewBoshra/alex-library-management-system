import { BorrowerDto } from '@borrowing/dtos/borrower.dto';
import { Borrower } from '@borrowing/entities/borrower.entity';

export class BorrowerMapper {
  static toEntity(bookDto: BorrowerDto): Borrower {
    return {
      id: bookDto.id,
      name: bookDto.name,
      email: bookDto.email,
      registeredAt: bookDto.registeredAt,
    };
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
