import { DomainException } from '@common/exceptions/domain-exception';

export class BookWithISBNAlreadyAdded extends DomainException {
  constructor(isbn: string) {
    super(`Book with ISBN ${isbn} is already added`);
  }
}
