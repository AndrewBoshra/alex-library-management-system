import { DomainException } from '@common/exceptions/domain-exception';

export class BorrowerCantBeDeletedHasBook extends DomainException {
  constructor(borrowerId: number) {
    super(
      `Borrower with id ${borrowerId} can't be deleted because he/she has book(s)`,
    );
  }
}
