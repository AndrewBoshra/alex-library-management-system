import { DomainException } from '@common/exceptions/domain-exception';

export class NoAvailableBookException extends DomainException {
  constructor(bookId: number) {
    super(`No available book with id ${bookId}`);
  }
}
