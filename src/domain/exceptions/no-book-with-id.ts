import { DomainException } from '@common/exceptions/domain-exception';

export class NoBookWithIdException extends DomainException {
  constructor(bookId: number) {
    super(`No book with id ${bookId}`);
  }
}
