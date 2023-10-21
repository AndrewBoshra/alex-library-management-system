import { DomainException } from '@common/exceptions/domain-exception';

export class AlreadyBorrowedBookException extends DomainException {
  constructor(bookId: number, recordId: number) {
    super(`Book with id ${bookId} is already borrowed in record ${recordId}`);
  }
}
