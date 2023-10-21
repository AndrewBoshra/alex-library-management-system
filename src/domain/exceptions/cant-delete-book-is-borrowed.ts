import { DomainException } from '@common/exceptions/domain-exception';

export class BookCantBeDeletedIsBorrowed extends DomainException {
  constructor(bookId) {
    super(
      `Book with id ${bookId} can't be deleted because it is borrowed before delete the records first`,
    );
  }
}
