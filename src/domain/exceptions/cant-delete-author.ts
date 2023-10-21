import { DomainException } from '@common/exceptions/domain-exception';

export class AuthorCantBeDeletedHasBook extends DomainException {
  constructor(authorId: number) {
    super(
      `Author with id ${authorId} can't be deleted because he/she has book(s)`,
    );
  }
}
